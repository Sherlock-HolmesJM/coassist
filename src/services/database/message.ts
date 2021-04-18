import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { MessageI } from '../../types';
import { arrayToObject } from '../transformer';

export const setMessage = (message: MessageI) =>
  firebase
    .database()
    .ref(path() + 'messages/' + message.uid)
    .set(message)
    .catch((e) => alert(e.message));

export const updateMessages = (messages: MessageI[]) => {
  const arr = JSON.parse(JSON.stringify(messages));
  arr.forEach((m) => delete m.workers);
  const obj = arrayToObject(arr);

  firebase
    .database()
    .ref(path() + 'messages')
    .update(obj)
    .catch((e) => alert(e.message));
};

export const updateMessage = (message: MessageI) => {
  const m = { ...message, workers: [] } as any;
  delete m.workers;

  firebase
    .database()
    .ref(path() + 'messages/' + message.uid)
    .update(m)
    .catch((e) => alert(e.message));
};

export const removeMessage = (muid: number) =>
  firebase
    .database()
    .ref(path() + 'messages/' + muid)
    .remove()
    .catch((e) => alert(e.message));
