import MemberI, { MemberType, MessageI, Worker } from '../../types/member';
import { capitalize } from '../../util';

// export function getWorkers(members: MemberI[], message: string) {
//   return members.filter((m) => m.works.find((w) => w.name === message));
// }

export const getNewMembers = (member: MemberI, members: MemberI[]) => {
  const newMembers = [...members];
  let index = newMembers.findIndex((m) => m.name === member.name);
  newMembers[index] = member;
  return newMembers;
};

export const getNewMessages = (message: MessageI, messages: MessageI[]) => {
  const newMessages = [...messages];
  const index = newMessages.findIndex((m) => m.name === message.name);
  newMessages[index] = message;
  return newMessages;
};

export const getMemberStatus = (workerName: string, messages: MessageI[]) => {
  const msg = messages.find((m) =>
    m.workers.filter((w) => w.name === workerName).find((w) => w.done === false)
  );

  console.log(
    workerName,
    ' is working on ',
    msg?.workers.find((w) => w.name === workerName)
  );
  // returns false if name is still working on a message.
  return msg ? false : true;
};

export const getMessageStatus = (message: MessageI) => {
  const totalWorks = message.workers.length;
  const workDone = message.workers.reduce(
    (a, wkr) => a + (wkr.done ? 1 : 0),
    0
  );
  let status = message.status;

  if (totalWorks === workDone && workDone !== 0) status = 'done';
  else if (totalWorks === workDone && workDone === 0) status = 'undone';
  else status = 'in-progress';

  console.log({ totalWorks, workDone, status });
  return status;
};

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
