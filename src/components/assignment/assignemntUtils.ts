import { MessageI } from '../../types';

export const determineSent = (message: MessageI, sent: 'yes' | 'no' | '') => {
  return message.transcribed === 'yes' && message.edited === 'yes' ? sent : '';
};
