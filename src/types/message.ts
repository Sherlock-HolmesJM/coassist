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
  sent: 'yes' | 'no';
}

export interface Messages {
  [key: string]: MessageI;
}

export type MessageStatus =
  | 'done'
  | 'undone'
  | 'in-progress'
  | 'transcribed'
  | 'incomplete';
