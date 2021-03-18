import styled from 'styled-components';
import { capitalize } from '../../util';
import { Worker } from '../../types/member';

export interface ListProps {
  workers: Worker[];
  title: string;
  done: boolean;
  onDelete: (worker: Worker) => void;
  onMark: (worker: Worker) => void;
  onUpdate: (worker: Worker) => void;
}

const List: React.FC<ListProps> = (props) => {
  const { title, workers, onMark, onDelete, onUpdate } = props;

  return (
    <Div className='list'>
      <h3 className='title'>{capitalize(title)} </h3>
      <ul className='list-group'>
        {workers
          .sort((a, b) => a.part.localeCompare(b.part))
          .sort((a, b) => a.type.length - b.type.length)
          .map((worker) => {
            return (
              <li className='list-group-item' key={worker.part}>
                <div>
                  <div>
                    {capitalize(worker.name)} - {worker.type}:
                  </div>
                  <div>
                    <em>{worker.part.toUpperCase()}</em>
                  </div>
                </div>
                <div>
                  <span
                    className={`badge bg-${
                      worker.done ? 'success' : 'secondary'
                    }`}
                    onClick={() => onMark(worker)}
                  >
                    {worker.done ? 'D' : 'IP'}
                  </span>
                  <span
                    className='badge bg-warning'
                    onClick={() => onUpdate(worker)}
                  >
                    {!worker.done && 'U'}
                  </span>
                  <span
                    className='badge bg-danger'
                    onClick={() => onDelete(worker)}
                  >
                    X
                  </span>
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
  .title {
    font-size: clamp(1.2rem, 4vw, 1.75rem);
    padding: 5px;
  }
  li {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  .badge {
    color: white;
    cursor: pointer;
    margin: 4px;
    font-size: 14px;
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
