import MemberI, { Members, MessageI, Messages } from '../types/member';

interface ServerState {
  members: Members;
  messages: Messages;
}

export const transformMembers = (members: MemberI[]) => {
  const transMembers: Members = {};
  members.forEach((m) => (transMembers[m.name] = m));
  return transMembers;
};

export const transform = (data: ServerState) => {
  const { messages, members } = data;

  let newMessages: MessageI[] = [];
  let newMembers: MemberI[] = [];

  if (messages) {
    newMessages = Object.entries(messages).reduce(
      (a: MessageI[], m) => [...a, m[1]],
      []
    );
  }
  if (members) {
    newMembers = Object.entries(members).reduce(
      (a: MemberI[], m) => [...a, m[1]],
      []
    );
  }

  return { members: newMembers, messages: newMessages };
};
