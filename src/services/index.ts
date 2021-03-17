import members from './members';
import { MessageI } from '../types/member';
import * as db from './database';

const messages: MessageI[] = [
  {
    name: 'glh-wed190919',
    status: 'undone',
  },
  {
    name: 'glh-wed190911',
    status: 'undone',
  },
  {
    name: 'glh-wed190912',
    status: 'undone',
  },
  {
    name: 'glh-wed190913',
    status: 'undone',
  },
  {
    name: 'glh-wed190914',
    status: 'undone',
  },
];

export { db };

export const data = {
  members,
  messages,
};
