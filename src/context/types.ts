import { MemberI } from '../components/members';
import { MessagesI } from './context';

export const SET_LIST = 'SET_LIST';
export const SET_MEMBERS = 'SET_MEMBERS';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';

export interface SetList {
  type: typeof SET_LIST;
  payload: string[];
}
export interface SetMembers {
  type: typeof SET_MEMBERS;
  payload: MemberI[];
}

export interface UpdateWorker {
  type: typeof UPDATE_MESSAGES;
  payload: MessagesI;
}

export type AllActions = SetList | SetMembers | UpdateWorker;
