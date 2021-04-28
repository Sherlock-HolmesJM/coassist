import firebase from 'firebase/app';
import 'firebase/database';
import { State } from '../../context/context';
import { swale, swals } from '../../utils';
import { transform } from '../transformer';
import { path } from './index';
import { updateWorker } from './worker';

const giveDateReceived = (state: State) => {
  let some = false;

  state.messages.forEach((m) => {
    m.workers.forEach((w) => {
      if (!w.dateReceived) {
        w.dateReceived = new Date().toJSON();
        updateWorker(w);
        some = true;
      }
    });
  });

  if (some) swals('Added missing propertyto workers');

  return state;
};

export const getData = () =>
  firebase
    .database()
    .ref(path())
    .get()
    .then((r) => giveDateReceived(transform(r.val()) as State))
    .catch((e) => {
      swale(e.message);
      return null;
    });

export const updateCGNames = (collatorName: string, groupName: string) =>
  firebase
    .database()
    .ref(path())
    .update({
      collatorName,
      groupName,
    })
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
