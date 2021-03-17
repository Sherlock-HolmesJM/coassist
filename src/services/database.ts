import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import MemberI, { MessageI } from '../types/member';
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

export const storeMessage = (message: MessageI) =>
  firebase
    .database()
    .ref(path() + 'messages/' + message.name)
    .set(message)
    .catch((e) => console.log(e.message));

export const deleteMessage = (name: string) =>
  firebase
    .database()
    .ref(path() + 'messages/' + name)
    .remove()
    .catch((e) => console.log(e.message));
