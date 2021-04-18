import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { Worker } from '../../types';
import { arrayToObject } from '../transformer';

export const updateWorkers = (workers: Worker[]) =>
  firebase
    .database()
    .ref(path() + '/messages/' + workers[0].msguid + '/workers')
    .update(arrayToObject(workers))
    .catch((e) => alert(e.message));

export const setWorker = (worker: Worker) =>
  firebase
    .database()
    .ref(path() + '/messages/' + worker.msguid + '/workers/' + worker.uid)
    .set(worker)
    .catch((e) => alert(e.message));

export const removeWorker = (muid: number, wuid: number) =>
  firebase
    .database()
    .ref(path() + '/messages/' + muid + '/workers/' + wuid)
    .remove()
    .catch((e) => alert(e.message));
