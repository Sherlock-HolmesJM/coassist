import { Worker } from '../types';
import { formatCap } from './time';

export const getWorkersCapacity = (worker: Worker[]) => {
  const tsc = worker
    .filter((w) => w.type === 'T')
    .reduce((acc, w) => acc + w.splitLength, 0);

  const tesc = worker
    .filter((w) => w.type === 'TE')
    .reduce((acc, w) => acc + w.splitLength, 0);

  return {
    tc: formatCap(tsc),
    tec: formatCap(tesc),
    tcn: tsc,
    tecn: tesc,
  };
};
