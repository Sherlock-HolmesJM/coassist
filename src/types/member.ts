export type MemberStatus = 'active' | 'inactive';
export type MemberType = 'TE' | 'T';

export interface Work {
  name: string;
  done: boolean;
}

export interface Works {
  [index: string]: Work;
}

export interface Members {
  [key: string]: MemberI;
}

export interface MemberI {
  name: string;
  type: MemberType;
  status: MemberStatus;
  free: boolean;
  works: Works;
}

export default MemberI;
