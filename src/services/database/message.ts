import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { MessageI } from '../../types';

export const setMessage = (message: MessageI) =>
  firebase
    .database()
    .ref(path() + 'messages/' + message.uid)
    .set(message)
    .catch((e) => console.log(e.message));

export const updateMessages = () => {};

export const updateMessage = (message: MessageI) => {
  firebase
    .database()
    .ref(path() + 'messages/' + message.uid)
    .update({
      status: message.status,
      edited: message.edited,
      transcribed: message.transcribed,
    })
    .catch((e) => console.log(e.message));
};

export const removeMessage = (muid: number) =>
  firebase
    .database()
    .ref(path() + 'messages/' + muid)
    .remove()
    .catch((e) => console.log(e.message));
