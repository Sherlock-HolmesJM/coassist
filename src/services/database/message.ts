import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { MessageI } from '../../types';
import { arrayToObject } from '../transformer';
import { swale, swals } from '../../utils';

export const setMessage = (message: MessageI) =>
  firebase
    .database()
    .ref(path() + 'messages/' + message.uid)
    .set(message)
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));

export const updateMessages = (messages: MessageI[]) => {
  const obj = arrayToObject(messages) as any;
  for (const key in obj) obj[key].workers = arrayToObject(obj[key].workers);

  firebase
    .database()
    .ref(path() + 'messages')
    .update(obj)
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
};

export const updateMessage = (message: MessageI) => {
  const m = { ...message, workers: [] } as any;
  delete m.workers;

  firebase
    .database()
    .ref(path() + 'messages/' + message.uid)
    .update(m)
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
};

export const removeMessage = (muid: number) =>
  firebase
    .database()
    .ref(path() + 'messages/' + muid)
    .remove()
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
