import styled from 'styled-components';
import { capitalize } from '../../utils';
import { Worker } from '../../types';
import { ClickBadge } from '../../commons/badge';

export interface ListProps {
  workers: Worker[];
  title: string;
  done: boolean;
  onDelete: (worker: Worker) => void;
  onMark: (worker: Worker) => void;
  onUpdate: (worker: Worker) => void;
  length: string;
}

const List: React.FC<ListProps> = (props) => {
  const { title, workers, onMark, onDelete, onUpdate, length } = props;

  const tes = workers.filter((w) => w.type === 'TE').length;
  const ts = workers.filter((w) => w.type === 'T').length;

  return (
    <Div className='list'>
      <div className='title-container'>
        <h3 className='title'>{capitalize(title)} </h3>
        <div className='badge badge-secondary bg-summary'>
          T:TE - {ts}:{tes}; Length: {length}
        </div>
      </div>
      <ul className='list-group'>
        {workers
          .sort((a, b) => a.part.localeCompare(b.part))
          .sort((a, b) => a.type.length - b.type.length)
          .map((worker) => {
            return (
              <li className='list-group-item' key={worker.uid}>
                <div>
                  <div>
                    {capitalize(worker.name)} - {worker.type}:
                  </div>
                  <div>
                    <em>{worker.part.toUpperCase()}</em>
                  </div>
                  <div>
                    <em>{worker.splitLength} Mins</em>
                  </div>
                </div>
                <div>
                  <ClickBadge
                    color={worker.done ? 'success' : 'secondary'}
                    onClick={() => onMark(worker)}
                    text={worker.done ? 'D' : 'IP'}
                  />
                  <ClickBadge
                    color='warning'
                    onClick={() => onUpdate(worker)}
                    text='U'
                  />
                  <ClickBadge
                    color='danger'
                    onClick={() => onDelete(worker)}
                    text='X'
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </Div>
  );
};

const Div = styled.div`
  margin: 5px;
  position: relative;

  .badge-container {
    position: absolute;
    top: 25px;
    right: 1px;
  }
  .title-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
  }
  .title {
    font-size: clamp(1.2rem, 4vw, 1.75rem);
    padding: 5px;
  }
  .bg-summary {
    align-self: flex-end;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  @media print {
    .title {
      font-size: 1.2rem;
    }
    .badge-container {
      top: 12px;
      right: 2px;
    }
  }
`;

export default List;
