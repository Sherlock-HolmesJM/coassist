import styled from 'styled-components';
import { MemberI, MessageI, Worker } from '../../types';
import { Flex, FlexItem, Title } from './flex';

export interface NotAllocProps {
  audios: MessageI[];
  transcripts: Worker[];
  freemembers: MemberI[];
}

const NotAlloc: React.FC<NotAllocProps> = (props) => {
  const { audios, transcripts, freemembers } = props;

  const sortedAudios = audios.sort((a, b) => a.name.localeCompare(b.name));

  const sortedTranscripts = transcripts.sort((a, b) =>
    (a.part || a.name).localeCompare(b.part || b.name)
  );

  return (
    <Div>
      <Title>Not Allocated</Title>
      <Flex>
        <Item title='Audios' items={sortedAudios.map((m) => m.name)} />
        <Item
          title='Transcripts'
          items={sortedTranscripts.map((m) => m.part || m.name)}
        />
        <Item
          title='Free Team Members'
          items={freemembers.map((m) => `${m.name} - ${m.type}`)}
        />
      </Flex>
    </Div>
  );
};

interface ItemI {
  items: string[];
  title: string;
}

const Item = (props: ItemI) => {
  const { items, title } = props;
  const { length } = items;

  return (
    <FlexItem>
      {length > 0 && (
        <h5>
          {title} - {length}
        </h5>
      )}
      {length > 0 && (
        <div className='count-container'>
          {items.map((text, i) => (
            <div className='count-item' key={i}>
              {text}
            </div>
          ))}
        </div>
      )}
    </FlexItem>
  );
};

const Div = styled.div`
  .count-container {
    counter-reset: alone;
  }
  .count-item {
    counter-increment: alone;
  }
  .count-item::before {
    content: counter(alone) ') ';
  }
`;

export default NotAlloc;
