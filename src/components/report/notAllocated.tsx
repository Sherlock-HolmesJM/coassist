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

  const anims = ['fade-left', 'fade-up', 'zoom-in'];

  return (
    <div>
      <Title>Not Allocated</Title>
      <Flex>
        {list.map((obj, ind) => (
          <Item
            key={ind}
            title={obj.title}
            items={obj.items}
            animation={anims[ind]}
          />
        ))}
      </Flex>
    </div>
  );
};

interface ItemI {
  items: string[];
  title: string;
  animation?: string;
}

const Item = (props: ItemI) => {
  const { items, title, animation } = props;
  const { length } = items;

  if (length === 0) return null;

  return (
    <WrapperFlexItem data-aos={animation ?? ''}>
      <h5>
        {title} - {length}
      </h5>
      <div className='count-container'>
        {items.map((text, i) => (
          <div className='count-item' key={i}>
            {text}
          </div>
        ))}
      </div>
    </WrapperFlexItem>
  );
};

const WrapperFlexItem = styled(FlexItem)`
  background-color: #264653;
  color: white;

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
