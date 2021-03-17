import MemberI, { MemberType } from '../../types/member';
import { capitalize } from '../../util';

export function getWorkers(members: MemberI[], message: string) {
  return members.filter((m) => m.works.find((w) => w.name === message));
}

export const checkWork = (
  workers: MemberI[],
  workName: string,
  type: MemberType
) => {
  const wkr = workers.find(
    (wkr) => wkr.type === type && wkr.works.find((w) => w.part === workName)
  );

  const msgAlert = (name: string, d: 'done' | 'already') =>
    alert(`${capitalize(name)} is ${d} working on this file - ${workName}`);

  if (wkr && wkr.type) {
    if (wkr.works.find((w) => w.part === workName)?.done)
      msgAlert(wkr.name, 'done');
    else msgAlert(wkr.name, 'already');
    return true;
  }

  return false;
};
