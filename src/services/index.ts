import members from './members';
import { MessageI } from '../types/member';
import * as db from './database';

const messages: MessageI[] = [
  {
    name: 'glh-wed190919',
    status: 'undone',
    workers: [],
  },
  {
    name: 'glh-wed190911',
    status: 'undone',
    workers: [],
  },
  {
    name: 'glh-wed190912',
    status: 'undone',
    workers: [],
  },
  {
    name: 'glh-wed190913',
    status: 'undone',
    workers: [],
  },
  {
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
