import { Worker } from './worker';

export interface MessageI {
  muid: number;
  name: string;
  status: MessageStatus;
  dateReceived: string;
  dateReturned: string;
  category: 'sermon';
  tuid: number;
  teuid: number;
  size: number;
  duration: number;
  workers: Worker[];
  Ts: Worker[];
  TEs: Worker[];
}

export interface Messages {
  [key: string]: MessageI;
}

export type MessageStatus = 'done' | 'undone' | 'in-progress';
