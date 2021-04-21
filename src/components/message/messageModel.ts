import {
  createTorTE,
  MemberI,
  MemberType,
  MessageI,
  Worker,
} from '../../types';
import { capitalize, secondsToHMS } from '../../utils';

export const getAssignedLength = (workers: Worker[]) => {
  const duration = workers.reduce((acc, w) => acc + w.splitLength, 0);
  const { h, m, s } = secondsToHMS(duration * 60);
  return `${h}:${m}:${s}`;
};

const updateTorTE = (message: MessageI, ts: Worker[], tes: Worker[]) => {
  const { length: tl } = ts;
  const { length: tel } = tes;

  if (!message.transcriber) message.transcriber = createTorTE('T');
  if (!message.transcriptEditor) message.transcriptEditor = createTorTE('TE');

  message.transcriptEditor.name = tel === 1 ? tes[0].name : 'TEs';
  message.transcriber.name = tl === 1 ? ts[0].name : 'Ts';

  if (message.status === 'done') {
    const { dateReturned } = message.transcriptEditor;
    message.transcriptEditor.dateReturned = dateReturned || new Date().toJSON();
  } else {
    const { dateIssued } = message.transcriptEditor;
    message.transcriptEditor.dateIssued = dateIssued || new Date().toJSON();
  }

  if (message.transcribed === 'yes') {
    const { dateReturned } = message.transcriber;
    message.transcriber.dateReturned = dateReturned || new Date().toJSON();
  } else {
    const { dateIssued } = message.transcriber;
    message.transcriber.dateIssued = dateIssued || new Date().toJSON();
  }
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
    : workDuration >= duration
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
    message.transcribed === 'yes' && edited === 'yes'
      ? 'done'
      : worker
      ? 'in-progress'
      : message.transcribed === 'incomplete' || edited === 'incomplete'
      ? 'incomplete'
      : message.transcribed === 'yes'
      ? 'transcribed'
      : 'undone';

  updateTorTE(message, ts, tes);
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
  // returns false if name is still working on a message.
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
    alert(`${capitalize(name)} is ${d} working on this file - ${part}`);

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

// export const parseInput = (value: string, filename: string) => {
//   return value.slice(filename.length, value.length);
// };

// export const getPart = (split: string, messageName: string) => {
//   return parseInput(split, messageName) === '' ? messageName : split;
// };
