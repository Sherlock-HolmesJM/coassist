import { MemberI } from '../types';
import { formatCap } from './time';

export const getTeamCapacity = (members: MemberI[]) => {
  const tc = members
    .filter((m) => m.active && m.type === 'T')
    .reduce((acc, m) => acc + (m.capacity ?? 0), 0);
  const tec = members
    .filter((m) => m.active && m.type === 'TE')
    .reduce((acc, m) => acc + (m.capacity ?? 0), 0);

  return {
    ts: formatCap(tc),
    tes: formatCap(tec),
  };
};
