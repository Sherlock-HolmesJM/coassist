import firebase from 'firebase/app';
import 'firebase/database';
import { getMessageRank } from '../../components/message/messageModel';
import { State } from '../../context/context';
import { getWorkdone, swale, swals } from '../../utils';
import { transform } from '../transformer';
import { path, storypath } from './index';
import { updateMember } from './member';
import { updateMessageProp } from './message';
import { updateWorker } from './worker';

const giveMissingFields = (state: State) => {
  state.members.forEach((m) => {
    if (!m.capacity || m.capacity / 60 <= 10) {
      m.capacity = 1800; // that is, 1800 seconds  30 minutes.
      updateMember(m);
    } else {
      updateStory({ title: 'member_capacity', message: 'updated' });
    }
  });
  state.messages.forEach((m) => {
    if (!m.rank) {
      m.rank = getMessageRank(m.status);
      updateMessageProp(m, 'rank');
    } else {
      updateStory({ title: 'rank', message: 'updated' });
    }

    if (!m.sent2CGT) {
      m.sent2CGT = 'no';
      updateMessageProp(m, 'sent2CGT');
    } else {
      updateStory({ title: 'sent2CGT', message: 'updated' });
    }

    m.workers.forEach((w) => {
      if (!w.capacity || w.capacity / 60 <= 10) {
        w.capacity = 1800; // that is, 1800 seconds  30 minutes.
        updateWorker(w);
      } else {
        updateStory({ title: 'worker_capacity', message: 'updated' });
      }

      if (!w.workdone && w.workdone !== 0) {
        w.workdone = getWorkdone(w, state.messages);
        updateWorker(w);
      } else {
        updateStory({ title: 'workdone', message: 'updated' });
      }

      if (w.splitLength / 60 <= 10) {
        console.log(w.splitLength, 'below', w.splitLength * 60);
        w.dateReceived = w.dateReceived || new Date().toJSON();
        w.splitLength = w.splitLength * 60;
        updateWorker(w);
      } else {
        updateStory({ title: 'splitLength', message: 'updated' });
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

export const updateStory = (obj: { title: string; message: string }) => {
  firebase
    .database()
    .ref(storypath())
    .update({
      [obj.title]: obj.message,
    })
    .catch((e) => swale(e.message));
};
