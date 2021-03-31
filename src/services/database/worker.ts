import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { Worker } from '../../types';

export const setWorker = (worker: Worker) =>
  firebase
    .database()
    .ref(path() + '/messages/' + worker.msguid + '/workers/' + worker.uid)
    .set(worker);

export const removeWorker = (muid: number, wuid: number) =>
  firebase
    .database()
    .ref(path() + '/messages/' + muid + '/workers/' + wuid)
    .remove();
