import {
  createTorTE,
  MemberI,
  MemberType,
  MessageI,
  MessageStatus,
  T_And_TE,
  Worker,
} from '../../types';
import { MessageRank } from '../../types/message';
import { capitalize, secondsToHMS, swale } from '../../utils';

export const getAssignedLength = (workers: Worker[]) => {
  const duration = workers.reduce((acc, w) => acc + w.splitLength, 0);
  const { h, m, s } = secondsToHMS(duration);
  return `${h}:${m}:${s}`;
};

const getT_TE_Name = (workers: Worker[], type: 'T' | 'TE') => {
  const names = workers.reduce((acc, worker) => [...acc, worker.name], []);
  const uniqueNames = [...new Set(names)];
  const { length } = uniqueNames;
  return length === 1 ? uniqueNames[0] : length === 0 ? '' : type + 's';
};

const getDateIssued = (object: T_And_TE) => {
  if (object.name === '') {
    object.dateIssued = '';
    object.dateReturned = '';
  } else {
    const { dateIssued } = object;
    object.dateIssued === dateIssued || new Date().toJSON();
  }
};

const getDateReturned = (object: T_And_TE) => {
  const { dateReturned } = object;
  object.dateReturned = dateReturned || new Date().toJSON();
};

const updateTorTE = (message: MessageI, ts: Worker[], tes: Worker[]) => {
  if (!message.transcriber) message.transcriber = createTorTE('T');
  if (!message.transcriptEditor) message.transcriptEditor = createTorTE('TE');

  message.transcriptEditor.name = getT_TE_Name(tes, 'TE');
  message.transcriber.name = getT_TE_Name(ts, 'T');

  if (message.status === 'done') getDateReturned(message.transcriptEditor);
  else getDateIssued(message.transcriptEditor);

  if (message.transcribed === 'yes') getDateReturned(message.transcriber);
  else getDateIssued(message.transcriber);
};

const getSecond = (duration: number) => {
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration / 60) % 60);
  let s = duration - (h * 3600 + m * 60);
  s = s > 59 ? s % 60 : s;
  return s;
};

const transEditStatus = (
  workers: Worker[],
  duration: number,
  type: 'T' | 'TE'
) => {
  const wks = workers.filter((w) => w.type === type);

  const workDuration = wks
    .filter((w) => w.done)
    .reduce((acc, t) => acc + t.splitLength, 0);

  return wks.length === 0
    ? 'no' // no part has been assigned at all
    : workDuration >= duration - getSecond(duration)
    ? 'yes' // all splits have been assigned and completed
    : wks.some((w) => !w.done)
    ? 'in-progress' // at least one split is being worked on
    : 'incomplete'; // not all splits have been assigned and splits assigned have been completed
};

export const updateStatus = (message: MessageI) => {
  const { workers, duration } = message;

  const ts = workers.filter((w) => w.type === 'T');
  const tes = workers.filter((w) => w.type === 'TE');

  message.transcribed = transEditStatus(workers, duration, 'T');
  message.edited = transEditStatus(workers, duration, 'TE');

  const { edited } = message;

  if (edited === 'yes') message.transcribed = 'yes';

  const worker = workers.some((w) => !w.done);

  message.status =
    message.sent2CGT === 'yes'
      ? 'sent2CGT'
      : message.transcribed === 'yes' && edited === 'yes'
      ? 'done'
      : worker
      ? 'in-progress'
      : message.transcribed === 'incomplete' || edited === 'incomplete'
      ? 'incomplete'
      : message.transcribed === 'yes'
      ? 'transcribed'
      : 'undone';

  message.rank = getMessageRank(message.status);

  updateTorTE(message, ts, tes);

  console.log(message);
};

export const getMessageRank = (status: MessageStatus): MessageRank => {
  return status === 'undone'
    ? 1
    : status === 'incomplete'
    ? 2
    : status === 'transcribed'
    ? 3
    : status === 'in-progress'
    ? 4
    : status === 'done'
    ? 5
    : 6;
};

export const getNewMembers = (member: MemberI, members: MemberI[]) => {
  const newMembers = [...members];
  let index = newMembers.findIndex((m) => m.uid === member.uid);
  newMembers[index] = member;
  return newMembers;
};

export const getNewMessages = (message: MessageI, messages: MessageI[]) => {
  const newMessages = [...messages];
  const index = newMessages.findIndex((m) => m.name === message.name);
  newMessages[index] = message;
  return newMessages;
};

export const getMemberStatus = (muid: number, messages: MessageI[]) => {
  const msg = messages.find((m) =>
    m.workers.filter((w) => w.memuid === muid).find((w) => w.done === false)
  );
  // returns false if member is still working on a message.
  return msg ? false : true;
};

/**
 *
 * @param workers
 * @param part
 * @param type
 * @returns true if a worker of type is working or done with this part; false if no worker of type is working on this part.
 */
export const checkWork = (
  workers: Worker[],
  part: string,
  type: MemberType
) => {
  const wkr = workers.find((wkr) => wkr.type === type && wkr.part === part);

  const msgAlert = (name: string, d: 'done' | 'already') =>
    swale(
      `${capitalize(name)} is ${d} working on this file - ${part}`,
      'Duplicate work'
    );

  if (wkr) {
    if (wkr.done) msgAlert(wkr.name, 'done');
    else msgAlert(wkr.name, 'already');
    return true;
  }

  return false;
};

/**
 *
 * @param workers
 * @param part
 * @param worker
 * @returns true if worker is working on this part or no worker is working on this part; false if another worker is working on this part
 */
export const checkWorker = (
  workers: Worker[],
  part: string,
  worker: Worker
) => {
  if (worker.part === part) return true;
  return !checkWork(workers, part, worker.type);
};
