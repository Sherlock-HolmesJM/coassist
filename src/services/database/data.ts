import firebase from 'firebase/app';
import 'firebase/database';
import { getMessageRank } from '../../components/message/messageModel';
import { State } from '../../context/context';
import { swale, swals } from '../../utils';
import { transform } from '../transformer';
import { path } from './index';
import { updateMessageProp } from './message';
import { updateWorker } from './worker';

const giveMissingFields = (state: State) => {
  state.messages.forEach((m) => {
    if (!m.rank) {
      m.rank = getMessageRank(m.status);
      updateMessageProp(m, 'rank');
    }

    if (!m.sent2CGT) {
      m.sent2CGT = 'no';
      updateMessageProp(m, 'sent2CGT');
    }

    m.workers.forEach((w) => {
      if (w.splitLength / 60 <= 10) {
        console.log(w.splitLength, 'below');
        w.dateReceived = w.dateReceived || new Date().toJSON();
        w.splitLength = w.splitLength * 60;
        updateWorker(w);
      }
    });
  });

  return state;
};

export const getData = () =>
  firebase
    .database()
    .ref(path())
    .get()
    .then((r) => giveMissingFields(transform(r.val()) as State))
    .catch((e) => {
      swale(e.message);
      return null;
    });

export const updateCGNames = (collatorName: string, groupName: string) => {
  firebase
    .database()
    .ref(path())
    .update({
      collatorName,
      groupName,
    })
    .then(() => swals('', 'Saved.'))
    .catch((e) => swale(e.message));
};
