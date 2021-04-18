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
  const obj = arrayToObject(messages) as any;
  for (const key in obj) obj[key].workers = arrayToObject(obj[key].workers);

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
