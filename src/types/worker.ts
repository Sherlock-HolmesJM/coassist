import { MemberType } from './member';

export interface Workers {
  [key: string]: Worker;
}

export interface Worker {
  memuid: number;
  name: string;
  type: MemberType;
  wuid: number;
  msguid: number;
  msgname: string;
  part: string;
  done: boolean;
}

export interface Transcriber {
  tuid: number;
  name: string;
  muid: number;
  msguid: number;
  msgname: string;
  msgpart: string;
}

export interface TranscriptEditor {
  teuid: number;
  name: string;
  muid: number;
  msguid: number;
  msgname: string;
  msgpart: string;
}
