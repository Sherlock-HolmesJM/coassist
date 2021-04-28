import { Worker } from '../types';
import { secondsToHMS } from '../utils';
import styled from 'styled-components';

export interface TimeStampsProps {
  workers: Worker[];
}

const TimeStamps: React.FC<TimeStampsProps> = (props) => {
  const { workers } = props;

  if (workers.length === 0) return null;

  const parts = workers.reduce((acc, w) => [...acc, w.part], []);

  const uniqueParts = [...new Set(parts)].sort((a, b) => a.localeCompare(b));

  // durations are in minutes
  const durations: number[] = uniqueParts.reduce(
    (acc, p) => {
      const worker = workers.find((w) => w.part === p);
      return [...acc, worker.splitLength + acc[acc.length - 1]];
    },
    [0]
  );

  const timestamps = durations.reduce(
    (acc, d) => [...acc, secondsToHMS(d * 60)],
    []
  );

  return (
    <Div>
      <h5 className='timestamp-title'>Timestamps [Starting Points]</h5>
      <div>
        {uniqueParts.map((p, i) => {
          const { h, m, s } = timestamps[i];
          return (
            <div key={i}>
              <span className='filename'>{p}</span> - Time {h}:{m}:{s}
            </div>
          );
        })}
      </div>
    </Div>
  );
};

const Div = styled.div`
  margin: 20px;

  .timestamp-title {
    font-size: min(1.5rem, 5vw);
  }
  .filename {
    font-size: min(1.2rem, 5vw);
    text-transform: uppercase;
  }
`;

export default TimeStamps;
