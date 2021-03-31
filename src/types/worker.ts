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
