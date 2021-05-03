import React from 'react';
import { Worker } from '../../types';
import { formatCap } from '../../utils';
import { Flex, FlexDate, FlexItem, Title } from './flex';

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
    <div>
      <Title>Issued and Returned</Title>
      <Flex>
        <Item title='Issued' workers={issued} />
        <Item title='Returned' workers={returned} />
        <Item title='Outstanding [Ts]' workers={outstandingTs} />
        <Item title='Outstanding [TEs]' workers={outstandingTEs} />
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

  if (workers.length === 0) return null;

  const sorted = workers
    .sort((a, b) => a.part.localeCompare(b.part))
    .sort((a, b) => a.type.localeCompare(b.type));

  return (
    <FlexItem>
      <h5>{title}</h5>
      <div>
        {sorted.map((w, i) => (
          <div key={i}>
            <div style={{ fontWeight: 700 }}>
              {w.name} - {w.type}
            </div>
            <div>
              <div>
                <em>{w.part}</em>
              </div>
              <div>
                <em>{formatCap(w.splitLength)}</em>
              </div>
            </div>
            <FlexDate>
              <em>
                {new Date(w.dateReturned || w.dateReceived).toDateString()}
              </em>
            </FlexDate>
          </div>
        ))}
      </div>
    </FlexItem>
  );
};

export default IssuedReturned;
