import { MemberI, MessageI } from '../types';
import {
  SetMessages,
  SET_MESSAGES,
  SetMembers,
  SET_MEMBERS,
  SetMM,
  SET_MM,
  SetCG,
  SET_CG,
} from './types';

export const setCG = (collatorName: string, groupName: string): SetCG => ({
  type: SET_CG,
  payload: { collatorName, groupName },
});

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
