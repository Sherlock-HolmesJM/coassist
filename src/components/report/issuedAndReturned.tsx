import React from 'react';
import { Worker } from '../../types';
import { formatCap } from '../../utils';
import { Flex, FlexItem, Title } from './flex';
import styled from 'styled-components';

export interface IssuedReturnedProps {
  issued: Worker[];
  returned: Worker[];
  outstanding: Worker[];
}

const IssuedReturned: React.FC<IssuedReturnedProps> = (props) => {
  const { issued, returned, outstanding } = props;

  const outstandingTs = outstanding.filter((w) => w.type === 'T');
  const outstandingTEs = outstanding.filter((w) => w.type === 'TE');

  return (
    <Div>
      <Title>Issued and Returned</Title>

      <Flex>
        <Item title='Issued' workers={issued} />
        <Item title='Returned' workers={returned} />
        <Item title='Outstanding [Ts]' workers={outstandingTs} />
        <Item title='Outstanding [TEs]' workers={outstandingTEs} />
      </Flex>
    </Div>
  );
};

interface ItemProps {
  title: string;
  workers: Worker[];
}

const Item = (props: ItemProps) => {
  const { title, workers } = props;
  const { length } = workers;

  if (length === 0) return null;

  const sorted = workers
    .sort((a, b) => a.part.localeCompare(b.part))
    .sort((a, b) => a.type.localeCompare(b.type));

  return (
    <FlexItem className='cards-container'>
      <WorkerTitle>
        <div>{title}</div> <div>[{length}]</div>
      </WorkerTitle>
      <Wrapper>
        {sorted.map((w, i) => (
          <FlexItem className='worker-card' key={i}>
            <div style={{ fontWeight: 700 }}>
              {w.name} - {w.type}
            </div>
            <div>
              <div>
                <em>{w.part}</em>
              </div>
              <div className='worker-card-length'>
                <em>Length: {formatCap(w.splitLength)}</em>
              </div>
            </div>
            <div className='worker-card-date'>
              <em>
                {new Date(w.dateReceived).toDateString()}
                {w.dateReturned &&
                  ` - ${new Date(w.dateReturned).toDateString()}`}
              </em>
            </div>
          </FlexItem>
        ))}
      </Wrapper>
    </FlexItem>
  );
};

const Div = styled.div`
  .cards-container {
    padding: 10px;
  }
`;

const WorkerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px 5px 5px;
  font-weight: 700;
  font-size: 20px;
`;

const Wrapper = styled(Flex)`
  margin-top: 0;

  .worker-card-length {
    font-size: 13px;
    font-weight: 640;
  }
  .worker-card-date {
    font-size: 13px;
    font-weight: 650;
  }
`;

export default IssuedReturned;
