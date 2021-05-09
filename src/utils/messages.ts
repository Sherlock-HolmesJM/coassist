import { MemberType, MessageI, Worker } from '../types';
import { checkDate, getWeekBegin, getWeekEnd } from './date';

const totals = (workers: Worker[], type: MemberType) => {
  return workers
    .filter((w) => w.type === type)
    .reduce(
      (acc, w) => {
        return { ...acc, [`${w.done}`]: acc[`${w.done}`] + w.splitLength };
      },
      { false: 0, true: 0 }
    );
};

export const getMessageTotals = (message: MessageI) => {
  const totalTs = totals(message.workers, 'T');
  const totalTEs = totals(message.workers, 'TE');

  return {
    working_t: totalTs.false,
    done_t: totalTs.true,
    working_te: totalTEs.false,
    done_te: totalTEs.true,
  };
};

const weekbegan = getWeekBegin('Sat');
const weekends = getWeekEnd(weekbegan);

/**
 *
 * @param workerUID
 * @param messages
 * @returns amount of work done this week in seconds.
 */
export const setWorkdone = (worker: Worker, messages: MessageI[]) => {
  let seconds = 0;

  messages.forEach((message) => {
    const list = message.workers.filter(
      (w) =>
        w.done &&
        w.memuid === worker.memuid &&
        checkDate(new Date(w.dateReceived), weekbegan, weekends) &&
        checkDate(new Date(w.dateReturned), weekbegan, weekends)
    );

    seconds = seconds + list.reduce((acc, w) => acc + w.splitLength, 0);
  });

  messages.forEach((message) => {
    message.workers
      .filter((w) => w.memuid === worker.memuid)
      .forEach((w) => (w.workdone = seconds));
  });

  return seconds;
};
