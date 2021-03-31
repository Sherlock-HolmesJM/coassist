import firebase from 'firebase/app';
import 'firebase/database';
import { transform } from '../transformer';
import { path } from './index';

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
