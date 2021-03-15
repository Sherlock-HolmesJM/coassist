import { MemberI } from '../components/members';
import { MessagesI } from './context';
import {
  UpdateWorker,
  UPDATE_MESSAGES,
  SetList,
  SetMembers,
  SET_LIST,
  SET_MEMBERS,
} from './types';

export const updateMessages = (messages: MessagesI): UpdateWorker => ({
  type: UPDATE_MESSAGES,
  payload: messages,
});

export const setList = (list: string[]): SetList => ({
  type: SET_LIST,
  payload: list,
});
export const setMembers = (members: MemberI[]): SetMembers => ({
  type: SET_MEMBERS,
  payload: members,
});
