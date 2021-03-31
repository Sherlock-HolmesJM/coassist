import firebase from 'firebase/app';
import 'firebase/database';
import { path } from '.';
import { MessageI, MemberI } from '../../types';

export const updateMM = (member: MemberI, message: MessageI) => {
  const update: any = {};
  update['members/' + member.uid] = member;
  update['messages/' + message.uid] = {
    status: message.status,
    edited: message.edited,
    transcribed: message.transcribed,
  };

  firebase.database().ref(path()).update(update);
};
