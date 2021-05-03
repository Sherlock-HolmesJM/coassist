import { T_And_TE, Worker } from './worker';

export interface MessageI {
  uid: number;
  name: string;
  status: MessageStatus;
  category: 'sermon';
  transcriber: T_And_TE;
  transcriptEditor: T_And_TE;
  size: number;
  duration: number;
  workers: Worker[];
  transcribed: 'yes' | 'in-progress' | 'no' | 'incomplete';
  edited: 'yes' | 'in-progress' | 'no' | 'incomplete';
  splits: number;
  splitLength: number;
  originalLength: string;
  sent2CGT: 'yes' | 'no' | '';
  rank: MessageRank;
}

export interface Messages {
  [key: string]: MessageI;
}

export type MessageRank = 1 | 2 | 3 | 4 | 5 | 6;

export type MessageStatus =
  | 'undone'
  | 'incomplete'
  | 'transcribed'
  | 'in-progress'
  | 'done'
  | 'sent2CGT';
