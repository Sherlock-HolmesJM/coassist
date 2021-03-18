export type MemberStatus = 'active' | 'inactive';
export type MemberType = 'TE' | 'T';

export interface Worker {
  wid: number;
  name: string;
  type: MemberType;
  message: string;
  part: string;
  done: boolean;
}

export interface Workers {
  [key: string]: Worker;
}

export interface Members {
  [key: string]: MemberI;
}

export interface Messages {
  [key: string]: MessageI;
}

export type MessageStatus = 'done' | 'undone' | 'in-progress';

export interface MemberI {
  name: string;
  type: MemberType;
  active: boolean;
  free: boolean;
}

export interface MessageI {
  name: string;
  status: 'in-progress' | 'done' | 'undone';
  workers: Worker[];
}

export default MemberI;
