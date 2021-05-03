import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { Worker } from '../../types';
import { arrayToObject } from '../transformer';
import { swale, swals } from '../../utils';

export const updateWorkers = (workers: Worker[]) => {
  if (workers.length === 0) return;

  firebase
    .database()
    .ref(path() + '/messages/' + workers[0].msguid + '/workers')
    .update(arrayToObject(workers))
    .then(() => swals('', 'Updated.'))
    .catch((e) => swale(e.message));
};

export const updateWorker = (worker: Worker) => {
  const { dateReceived, splitLength } = worker;
  return firebase
    .database()
    .ref(path() + '/messages/' + worker.msguid + '/workers/' + worker.uid)
    .update({ dateReceived, splitLength })
    .catch((e) => swale(e.message));
};

export const setWorker = (worker: Worker) =>
  firebase
    .database()
    .ref(path() + '/messages/' + worker.msguid + '/workers/' + worker.uid)
    .set(worker)
    .then(() => swals('', 'Saved'))
    .catch((e) => swale(e.message));

export const removeWorker = (muid: number, wuid: number) =>
  firebase
    .database()
    .ref(path() + '/messages/' + muid + '/workers/' + wuid)
    .remove()
    .then(() => swals('', 'Deleted'))
    .catch((e) => swale(e.message));
