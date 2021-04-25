import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import * as mem from './member';
import * as msg from './message';
import * as wrk from './worker';
import * as data from './data';
import { MemberI, MessageI, Worker } from '../../types';

export const uid = () => firebase.auth().currentUser?.uid;
export const path = () => '/coassist/' + uid() + '/data/';

export const chainupdateMMW = (
  worker: Worker,
  message: MessageI,
  member: MemberI
) => {
  mem.updateMember(member);
  msg.updateMessage(message);
  wrk.setWorker(worker);
};

export const db = { ...mem, ...msg, ...wrk, ...data };
export * from './member';
export * from './message';
export * from './worker';
export * from './data';
