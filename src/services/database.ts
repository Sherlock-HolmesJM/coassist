import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { MemberI, MessageI, Worker } from '../types';
import { transform, transformMembers } from './transformer';

const uid = () => firebase.auth().currentUser?.uid;
const path = () => '/coassist/' + uid() + '/data/';

export const getData = () =>
  firebase
    .database()
    .ref(path())
    .get()
    .then((r) => transform(r.val()))
    .catch((e) => null);

export const updateCGNames = (collatorName: string, groupName: string) =>
  firebase.database().ref(path()).update({
    collatorName,
    groupName,
  });

export const updateMembers = (members: MemberI[]) =>
  firebase
    .database()
    .ref(path() + 'members')
    .update(transformMembers(members))
    .catch((e) => console.log(e.message));

export const setMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.muid)
    .set(member)
    .catch((e) => console.log(e.message));

export const updateMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.muid)
    .update(member)
    .catch((e) => console.log(e.message));

export const deleteMember = (muid: number) =>
  firebase
    .database()
    .ref(path() + 'members/' + muid)
    .remove()
    .catch((e) => console.log(e.message));

export const setMessage = (message: MessageI) =>
  firebase
    .database()
    .ref(path() + 'messages/' + message.muid)
    .set(message)
    .catch((e) => console.log(e.message));

export const updateMessage = (message: MessageI) => {
  firebase
    .database()
    .ref(path() + 'messages/' + message.muid)
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

export const setWorker = (worker: Worker) =>
  firebase
    .database()
    .ref(path() + '/messages/' + worker.msguid + '/workers/' + worker.wuid)
    .set(worker);

export const removeWorker = (muid: number, wuid: number) =>
  firebase
    .database()
    .ref(path() + '/messages/' + muid + '/workers/' + wuid)
    .remove();
