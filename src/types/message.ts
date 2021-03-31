import { Worker } from './worker';

export interface MessageI {
  uid: number;
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
  transcribed: 'yes' | 'in-progress' | 'no';
  edited: 'yes' | 'in-progress' | 'no';
  parts: number;
}

export interface Messages {
  [key: string]: MessageI;
}

export type MessageStatus = 'done' | 'undone' | 'in-progress' | 'transcribed';
