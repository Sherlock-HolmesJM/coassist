import MemberI, {
  Members,
  MessageI,
  Messages,
  Worker,
  Workers,
} from '../types/member';

interface ServerState {
  members: Members;
  messages: Messages;
}

export const transformMembers = (members: MemberI[]) => {
  const transMembers: Members = {};
  members.forEach((m) => (transMembers[m.name] = m));
  return transMembers;
};

export const revert = <G, T>(object: G): T[] => {
  if (!object) return [];
  return Object.entries(object).reduce((a: T[], n) => [...a, n[1]], []);
};

export const transform = (data: ServerState) => {
  const { messages: msgs, members: membs } = data;

  let messages: MessageI[] = [];
  let members: MemberI[] = [];

  if (members) members = revert<Members, MemberI>(membs);
  if (messages) {
    messages = revert<Messages, MessageI>(msgs);
    messages.forEach(
      (m) =>
        (m.workers = revert<Workers, Worker>((m.workers as unknown) as Workers))
    );
  }

  return { members, messages };
};
