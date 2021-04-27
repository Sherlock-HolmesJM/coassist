import firebase from 'firebase/app';
import 'firebase/auth';
import { swale } from '../utils';

export const googleSignIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .catch((e) => swale(e));
};

export const signOut = () => firebase.auth().signOut();
