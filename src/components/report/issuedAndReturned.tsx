import React from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import { Worker } from '../../types';
import { formatCap } from '../../utils';
import { congrats } from '../../media';
import { Flex, FlexItem, Title } from './flex';

export interface IssuedReturnedProps {
  issued: Worker[];
  returned: Worker[];
  outstanding: Worker[];
}

const IssuedReturned: React.FC<IssuedReturnedProps> = (props) => {
  const { issued, returned, outstanding } = props;

  const list = [
    { title: 'Issued [Ts]', workers: issued.filter((w) => w.type === 'T') },
    { title: 'Issued [TEs]', workers: issued.filter((w) => w.type === 'TE') },
    { title: 'Returned [Ts]', workers: returned.filter((w) => w.type === 'T') },
    {
      title: 'Returned [TEs]',
      workers: returned.filter((w) => w.type === 'TE'),
    },
    {
      title: 'Outstanding [Ts]',
      workers: outstanding.filter((w) => w.type === 'T'),
    },
    {
      title: 'Outstanding [TEs]',
      workers: outstanding.filter((w) => w.type === 'TE'),
    },
  ];

  return (
    <div>
      <Title>Issued and Returned</Title>
      <Flex>
        {list.map(({ title, workers }, i) => (
          <Item key={i} title={title} workers={workers} />
        ))}
      </Flex>
    </div>
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
    // <FlexItemWrapper>
    <FlexItemWrapper data-aos='fade'>
      <WorkerTitle>
        <div>{title}</div> <div>[{length}]</div>
      </WorkerTitle>
      <FlexWrapper>
        {sorted.map((w, i) => {
          return (
            // <FlexItem className='worker-card' key={i}>
            <FlexItem className='worker-card' key={i} data-aos='slide-up'>
              {w.workdone >= w.capacity && (
                <div className='worker-card-congrats'>
                  <Lottie animationData={congrats} />
                </div>
              )}
              <div className='worker-card-name'>
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
                <em>Received: {new Date(w.dateReceived).toDateString()}</em>
              </div>
              <div className='worker-card-date'>
                <em>
                  {w.done &&
                    w.dateReturned &&
                    `Returned: ${new Date(w.dateReturned).toDateString()}`}
                </em>
              </div>
              <div className='worker-card-capacity worker-card-font-style'>
                Capacity: {formatCap(w.capacity)}
              </div>
              <div className='worker-card-font-style'>
                Work Done: {formatCap(w.workdone)}
              </div>
            </FlexItem>
          );
        })}
      </FlexWrapper>
    </FlexItemWrapper>
  );
};

const FlexItemWrapper = styled(FlexItem)`
  padding: 10px;
`;

const WorkerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px 5px 5px;
  font-weight: 700;
  font-size: 20px;
`;

const FlexWrapper = styled(Flex)`
  margin-top: 0;
  gap: 1em;

  .worker-card {
    position: relative;
    background-color: #264653;
    color: white;
  }
  .worker-card-congrats {
    position: absolute;
    top: 1px;
    right: 1px;
    width: max(15%, 100px);
  }
  .worker-card-name {
    font-weight: 700;
    border-bottom: 1px solid gray;
  }

  .worker-card-length,
  .worker-card-date,
  .worker-card-capacity,
  .worker-card-font-style {
    font-size: 14px;
  }
  .worker-card-capacity {
    border-top: 1px solid gray;
  }

  @media print {
    .worker-card {
      background-color: white;
      color: black;
    }
  }
`;

export default IssuedReturned;
