const list = ['glh-wed190919'];

const member = {
  name: 'ugochukwu',
  type: 'T',
  status: 'inactive',
  work: list[0] + '-s1',
  done: false,
};
const member2 = {
  name: 'sister ibim',
  type: 'TE',
  status: 'inactive',
  work: null,
  done: false,
};

const members = [member, member2];

const message = {
  filename: list[0],
  workers: [member],
  status: 'in-progress',
};

const messages = { [message.filename]: message };

export const data = {
  members,
  messages,
};
