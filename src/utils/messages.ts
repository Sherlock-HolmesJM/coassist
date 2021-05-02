import { Worker } from '../types';
import { formatCap } from './time';

export const getWorkCapacity = (workers: Worker[]) => {
  const capacity = workers.reduce((acc, w) => acc + w.splitLength, 0);
  return formatCap(capacity * 60);
};
