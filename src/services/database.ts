import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import MemberI, { MessageI, MessageStatus, Worker } from '../types/member';
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

export const updateMembers = (members: MemberI[]) =>
  firebase
    .database()
    .ref(path() + 'members')
    .update(transformMembers(members))
    .catch((e) => console.log(e.message));

export const setMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.name)
    .set(member)
    .catch((e) => console.log(e.message));

export const updateMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.name)
    .update(member)
    .catch((e) => console.log(e.message));

export const deleteMember = (name: string) =>
  firebase
    .database()
    .ref(path() + 'members/' + name)
    .remove()
    .catch((e) => console.log(e.message));

export const setMessage = (message: MessageI) =>
  firebase
    .database()
    .ref(path() + 'messages/' + message.name)
    .set(message)
    .catch((e) => console.log(e.message));

export const updateMessage = (message: {
  name: string;
  status: MessageStatus;
}) => {
  firebase
    .database()
    .ref(path() + 'messages/' + message.name)
    .update(message)
    .catch((e) => console.log(e.message));
};

export const removeMessage = (name: string) =>
  firebase
    .database()
    .ref(path() + 'messages/' + name)
    .remove()
    .catch((e) => console.log(e.message));

export const setWorker = (worker: Worker) =>
  firebase
    .database()
    .ref(path() + '/messages/' + worker.message + '/workers/' + worker.wid)
    .set(worker);

export const removeWorker = (message: string, wid: number) =>
  firebase
    .database()
    .ref(path() + '/messages/' + message + '/workers/' + wid)
    .remove();
