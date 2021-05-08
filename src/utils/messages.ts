import { MessageI } from '../types';
import { checkDate, getWeekBegin, getWeekEnd } from './date';

const weekbegan = getWeekBegin('Sat');
const weekends = getWeekEnd(weekbegan);

/**
 *
 * @param workerUID
 * @param messages
 * @returns amount of work done this week in seconds.
 */
export const getWorkdone = (workerUID: number, messages: MessageI[]) => {
  let seconds = 0;
  messages.forEach((m) => {
    seconds =
      seconds +
      m.workers
        .filter(
          (w) =>
            w.done &&
            w.uid === workerUID &&
            checkDate(new Date(w.dateReturned), weekbegan, weekends)
        )
        .reduce((acc, w) => acc + w.splitLength, 0);
  });

  return seconds;
};
