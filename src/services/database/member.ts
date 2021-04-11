import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { MemberI } from '../../types';
import { arrayToObject } from '../transformer';

export const updateMembers = (members: MemberI[]) =>
  firebase
    .database()
    .ref(path() + 'members')
    .update(arrayToObject(members))
    .catch((e) => alert(e.message));

export const setMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.uid)
    .set(member)
    .catch((e) => alert(e.message));

export const updateMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.uid)
    .update(member)
    .catch((e) => alert(e.message));

export const deleteMember = (muid: number) =>
  firebase
    .database()
    .ref(path() + 'members/' + muid)
    .remove()
    .catch((e) => alert(e.message));
