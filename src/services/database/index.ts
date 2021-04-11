import firebase from 'firebase/app';
import 'firebase/auth';
import * as member from './member';
import * as message from './message';
import * as worker from './worker';
import * as data from './data';

export const db = { ...member, ...message, ...worker, ...data };

export const uid = () => firebase.auth().currentUser?.uid;
export const path = () => '/coassist/' + uid() + '/data/';
