import { Transcriber, TranscriptEditor, Worker } from './worker';

export interface MessageI {
  uid: number;
  name: string;
  status: MessageStatus;
  category: 'sermon';
  transcriber: Transcriber | undefined;
  transcriptEditor: TranscriptEditor | undefined;
  size: number;
  duration: number;
  workers: Worker[];
  transcribed: 'yes' | 'in-progress' | 'no';
  edited: 'yes' | 'in-progress' | 'no';
  splits: number;
}

export interface Messages {
  [key: string]: MessageI;
}

export type MessageStatus = 'done' | 'undone' | 'in-progress' | 'transcribed';
