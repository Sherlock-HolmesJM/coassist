import members from './members';
import { MessageI } from '../types/member';
import * as db from './database';

const messages: MessageI[] = [
  {
    muid: Date.now(),
    name: 'glh-wed190919',
    status: 'undone',
    workers: [],
  },
  {
    muid: Date.now(),
    name: 'glh-wed190911',
    status: 'undone',
    workers: [],
  },
  {
    muid: Date.now(),
    name: 'glh-wed190912',
    status: 'undone',
    workers: [],
  },
  {
    muid: Date.now(),
    name: 'glh-wed190913',
    status: 'undone',
    workers: [],
  },
  {
    muid: Date.now(),
    name: 'glh-wed190914',
    status: 'undone',
    workers: [],
  },
];

export { db };

export const data = {
  members,
  messages,
};
