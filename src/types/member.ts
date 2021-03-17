export type MemberStatus = 'active' | 'inactive';
export type MemberType = 'TE' | 'T';

export interface Work {
  name: string;
  part: string;
  done: boolean;
}

export interface Members {
  [key: string]: MemberI;
}

export interface Messages {
  [key: string]: MessageI;
}

export interface MemberI {
  name: string;
  type: MemberType;
  active: boolean;
  free: boolean;
  works: Work[];
}

export interface MessageI {
  name: string;
  status: 'in-progress' | 'done' | 'undone';
}

export default MemberI;
