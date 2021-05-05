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
  splitLength: number; // in seconds
  dateReceived: string;
  dateReturned: string;
  capacity: number; // in seconds -- must come from the member.
}

export interface T_And_TE {
  name: string;
  uid: number;
  dateIssued: string;
  dateReturned: string;
  type: 'T' | 'TE';
}

export const createTorTE = (type: 'T' | 'TE'): T_And_TE => ({
  name: '',
  uid: 1,
  dateIssued: '',
  dateReturned: '',
  type,
});
