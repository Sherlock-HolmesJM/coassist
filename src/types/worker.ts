import { MemberType } from './member';

export interface Workers {
  [key: string]: Worker;
}

export interface Worker {
  memuid: number; // unique identifier of member
  name: string; // name of member
  type: MemberType;
  uid: number;
  msguid: number; // unique identifier of message
  msgname: string; // name of message
  part: string;
  done: boolean;
  dateReceived: string;
  dateReturned: string;
  splitLength: number; // in seconds
  capacity: number; // in seconds -- must come from the member.
  workdone: number; // total seconds of work done this week.
}

export interface T_And_TE {
  name: string;
  uid: number;
  dateIssued: string;
  dateReturned: string;
  type: 'T' | 'TE';
}

export const createT_TE = (type: 'T' | 'TE'): T_And_TE => ({
  name: '',
  uid: 1,
  dateIssued: '',
  dateReturned: '',
  type,
});
