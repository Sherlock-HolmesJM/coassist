import { MemberType } from './member';

export interface Workers {
  [key: string]: Worker;
}

export interface Worker {
  memuid: number;
  name: string;
  type: MemberType;
  uid: number;
  msguid: number;
  msgname: string;
  part: string;
  done: boolean;
  splitLength: number;
  dateReceived: string;
  dateReturned: string;
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
