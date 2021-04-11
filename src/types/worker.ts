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
}

interface T_And_TE {
  name: string;
  uid: number;
  dateReceived: string;
  dateReturned: string;
}

export interface Transcriber extends T_And_TE {
  type: 'T';
}

export interface TranscriptEditor extends T_And_TE {
  type: 'TE';
}
