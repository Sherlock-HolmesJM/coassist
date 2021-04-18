import {
  MemberI,
  Members,
  MessageI,
  Messages,
  Worker,
  Workers,
} from '../types';

export interface ServerState {
  groupName: string;
  collatorName: string;
  members: Members;
  messages: Messages;
}

type A = MemberI | Worker | MessageI;
type O = Members | Workers | Messages;

/**
 *
 * @param list of type MemberI | Worker | MessageI
 * @returns converts an object to array using the uid as key
 */
export const arrayToObject = (list: A[]) => {
  const result: O = {};
  const newList = JSON.parse(JSON.stringify(list)) as A[];
  newList.forEach((m) => (result[m.uid] = m));
  console.log(list, ' list');
  return result;
};

export const objectToArray = <G, T>(object: G): T[] => {
  if (!object) return [];
  const newObject = JSON.parse(JSON.stringify(object)) as G;
  return Object.entries(newObject).reduce((a: T[], n) => [...a, n[1]], []);
};

export const transform = (data: ServerState) => {
  if (!data) return null;

  const { messages: msgs, members: membs } = data;

  let messages: MessageI[] = [];
  let members: MemberI[] = [];

  if (membs) members = objectToArray<Members, MemberI>(membs);
  if (msgs) {
    messages = objectToArray<Messages, MessageI>(msgs);
    messages.forEach(
      (m) =>
        (m.workers = objectToArray<Workers, Worker>(
          (m.workers as unknown) as Workers
        ))
    );
  }

  return { ...data, members, messages };
};
