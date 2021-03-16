import { MemberI } from '../types/member';
import { MessageI } from '../types/member';
import {
  SetMessages,
  SET_MESSAGES,
  SetMembers,
  SET_MEMBERS,
  SetMM,
  SET_MM,
} from './types';

export const setMM = (messages: MessageI[], members: MemberI[]): SetMM => ({
  type: SET_MM,
  payload: {
    messages,
    members,
  },
});

export const setMessages = (messages: MessageI[]): SetMessages => ({
  type: SET_MESSAGES,
  payload: messages,
});

export const setMembers = (members: MemberI[]): SetMembers => ({
  type: SET_MEMBERS,
  payload: members,
});
