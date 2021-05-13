import { Flex, Title } from '../components/report/flex';
import { MessageI } from '../types';
import { formatCap, getMessageTotals } from '../utils';
import SumCard from './summaryCard';
import styled from 'styled-components';

export interface MessageSummaryProps {
  title: string;
  messages: MessageI[];
}

const MessageSummary: React.FC<MessageSummaryProps> = (props) => {
  const { title, messages } = props;

  if (messages.length === 0) return null;

  return (
    <Div>
      <Title>{title}</Title>
      <Flex>
        {messages.map((m, i) => {
          const totals = getMessageTotals(m);

          const anims = ['zoom-in', 'zoom-out', 'slideInUp', 'flip-down'];
          const rand = () => Math.floor(Math.random() * anims.length - 1);

          const list: [string, string][] = (
            [
              ['Length', m.duration],
              ['Transcribed', totals.done_t],
              ['Edited', totals.done_te],
              ['Transcribing', totals.working_t],
              ['Editing', totals.working_te],
            ] as [string, number][]
          )
            .filter((item) => item[1] > 0)
            .map((item) => [item[0], formatCap(item[1])]);

          return (
            <SumCard
              key={i}
              title={m.name}
              animation={anims[rand()]}
              items={list}
            />
          );
        })}
      </Flex>
    </Div>
  );
};

const Div = styled.div`
  background-color: #f4a261;
  padding: 10px 0;
`;

export default MessageSummary;
