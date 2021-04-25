import firebase from 'firebase/app';
import 'firebase/database';
import { path } from './index';
import { MemberI } from '../../types';
import { arrayToObject } from '../transformer';
import { swale, swals } from '../../utils';

export const updateMembers = (members: MemberI[]) =>
  firebase
    .database()
    .ref(path() + 'members')
    .update(arrayToObject(members))
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));

export const setMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.uid)
    .set(member)
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));

export const updateMember = (member: MemberI) =>
  firebase
    .database()
    .ref(path() + 'members/' + member.uid)
    .update(member)
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));

export const deleteMember = (muid: number) =>
  firebase
    .database()
    .ref(path() + 'members/' + muid)
    .remove()
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
