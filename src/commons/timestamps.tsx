import { Worker } from '../types';
import { secondsToHMS } from '../utils';
import styled from 'styled-components';

export interface TimeStampsProps {
  workers: Worker[];
}

const TimeStamps: React.FC<TimeStampsProps> = (props) => {
  const { workers } = props;
  const parts = workers.reduce((acc, w) => [...acc, w.part], []);

  const uniqueParts = [...new Set(parts)].sort((a, b) => a.localeCompare(b));

  // durations are in minutes
  const durations = workers.reduce(
    (acc, w, i) => {
      const worker = workers.find((w) => w.part === uniqueParts[i]);
      if (!worker) return acc;
      return [...acc, worker.splitLength + acc[acc.length - 1]];
    },
    [0]
  );

  const timestamps = durations.reduce(
    (acc, d) => [...acc, secondsToHMS(d * 60)],
    []
  );

  console.log(uniqueParts);

  return (
    <Div>
      <h5>Timestamps [starting points]</h5>
      <div>
        {uniqueParts.map((p, i) => {
          const { h, m, s } = timestamps[i];
          return (
            <div key={i}>
              {p} - Time: {h}:{m}:{s}
            </div>
          );
        })}
      </div>
    </Div>
  );
};

const Div = styled.div`
  margin: 20px;
  text-transform: uppercase;
`;

export default TimeStamps;
