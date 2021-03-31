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

export const arrayToObject = (list: A[]) => {
  const result: O = {};
  list.forEach((m) => (result[m.uid] = m));
  return result;
};

export const objectToArray = <G, T>(object: G): T[] => {
  if (!object) return [];
  return Object.entries(object).reduce((a: T[], n) => [...a, n[1]], []);
};

export const transform = (data: ServerState) => {
  const { messages: msgs, members: membs } = data;

  let messages: MessageI[] = [];
  let members: MemberI[] = [];

  if (members) members = objectToArray<Members, MemberI>(membs);
  if (messages) {
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
