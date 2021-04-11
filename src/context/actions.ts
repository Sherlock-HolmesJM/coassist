import { MemberI, MessageI } from '../types';
import { State } from './context';
import * as t from './types';

export const setState = (data: State): t.SetState => ({
  type: t.SET_STATE,
  payload: data,
});

export const toggleSpin = (spin: boolean): t.Spin => ({
  type: t.SPIN,
  payload: spin,
});

export const setCG = (collatorName: string, groupName: string): t.SetCG => ({
  type: t.SET_CG,
  payload: { collatorName, groupName },
});

export const setMM = (messages: MessageI[], members: MemberI[]): t.SetMM => ({
  type: t.SET_MM,
  payload: {
    messages,
    members,
  },
});

export const setMessages = (messages: MessageI[]): t.SetMessages => ({
  type: t.SET_MESSAGES,
  payload: messages,
});

export const setMembers = (members: MemberI[]): t.SetMembers => ({
  type: t.SET_MEMBERS,
  payload: members,
});
