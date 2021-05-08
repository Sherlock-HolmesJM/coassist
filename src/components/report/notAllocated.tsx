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

  const list = [
    { title: 'Audio', items: sortedAudios.map((m) => m.name) },
    {
      title: 'Transcripts',
      items: sortedTranscripts.map((m) => m.part || m.name),
    },
    {
      title: 'Free Team Members',
      items: freemembers.map((m) => `${m.name} - ${m.type}`),
    },
  ];

  const anims = ['fade-left', 'fade-up', 'fade-right'];

  return (
    <Div>
      <Title>Not Allocated</Title>
      <Flex>
        {list.map((obj, ind) => (
          <Item
            title={obj.title}
            items={obj.items}
            animation={anims[ind]}
            delay={300 * ind}
          />
        ))}
      </Flex>
    </Div>
  );
};

interface ItemI {
  items: string[];
  title: string;
  animation?: string;
  delay?: number;
}

const Item = (props: ItemI) => {
  const { items, title, delay, animation } = props;
  const { length } = items;

  return (
    <FlexItem data-aos={animation} data-aos-delay={delay}>
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
