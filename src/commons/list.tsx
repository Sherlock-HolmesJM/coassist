import { capitalize, secondsToHMS, secondsToMinutes } from '../utils';
import styled from 'styled-components';
import { MemberI } from '../types';
import { ClickBadge } from '../commons/badge';

export interface ListProps {
  items: MemberI[];
  title: string;
  onDelete?: (member: MemberI) => void;
  onMark?: (member: MemberI) => void;
  onUpdate?: (member: MemberI) => void;
}

const List: React.FC<ListProps> = (props) => {
  const { title, items, onMark, onDelete, onUpdate } = props;

  if (items.length === 0) return null;

  const ts = items.filter((m) => m.type === 'T');
  const tes = items.filter((m) => m.type === 'TE');
  const sorted = [...ts, ...tes];

  const formatCap = (capacity: number) => {
    const mins = secondsToMinutes(capacity);
    if (mins < 60) return `${mins}min`;

    const { h, m } = secondsToHMS(capacity);
    return `${+h}hr ${+m}min`;
  };

  return (
    <Div className='list animate__animated animate__fadeInUp'>
      <div className='title-container'>
        <h3 className='title'>{capitalize(title)} </h3>
        <div className='badge-container'>
          <span className='badge bg-warning m-1'>Ts: {ts.length}</span>
          <span className='badge bg-warning'>TEs: {tes.length}</span>
        </div>
      </div>
      <ul className='list-group'>
        {sorted.map((item) => (
          <li className='list-group-item' key={item.uid}>
            <div className='list-group-item-content'>
              <div>
                {capitalize(item.name)} - {item.type}
              </div>
              <div>
                <em>Capacity: {`${formatCap(item.capacity)}`}</em>
              </div>
              <div>
                <em>
                  {item.givenOut && `Given to: ${capitalize(item.givenOut)}`}
                </em>
              </div>
            </div>
            <div className='list-group-item-badges'>
              {onMark && (
                <ClickBadge
                  color='success'
                  onClick={() => onMark(item)}
                  text='M'
                />
              )}
              {onUpdate && (
                <ClickBadge
                  color='warning'
                  onClick={() => onUpdate(item)}
                  text='U'
                />
              )}
              {onDelete && (
                <ClickBadge
                  color='danger'
                  onClick={() => onDelete(item)}
                  text='X'
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Div>
  );
};

const Div = styled.div`
  margin: 10px;
  position: relative;

  .title-container {
    display: flex;
    justify-content: space-between;
  }
  .badge-container {
    align-self: flex-end;
  }
  .title {
    font-size: clamp(1.2rem, 4vw, 1.75rem);
    padding: 5px;
    margin-bottom: 20px;
  }
  .list-group-item {
    display: flex;
    padding: 5px;
  }
  .list-group-item-content {
    flex: 1;
  }
  .list-group-item-badges {
    display: flex;
    height: 30px;
  }

  @media print {
    .badge {
      border: none;
    }
  }
`;

export default List;
