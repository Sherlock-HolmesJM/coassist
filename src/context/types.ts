import { MemberI } from '../types/member';
import { MessageI } from '../types/member';

export const SET_MEMBERS = 'SET_MEMBERS';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_MM = 'SET_MM';
export const SET_CG = 'CG';

export interface SetCG {
  type: typeof SET_CG;
  payload: {
    collatorName: string;
    groupName: string;
  };
}

export interface SetMM {
  type: typeof SET_MM;
  payload: {
    members: MemberI[];
    messages: MessageI[];
  };
}

export interface SetMembers {
  type: typeof SET_MEMBERS;
  payload: MemberI[];
}

export interface SetMessages {
  type: typeof SET_MESSAGES;
  payload: MessageI[];
}

export type AllActions = SetMembers | SetMessages | SetMM | SetCG;
