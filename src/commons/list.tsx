import { capitalize } from '../util';
import styled from 'styled-components';
import { MemberI } from '../types';

export interface ListProps {
  items: MemberI[];
  title: string;
  onDelete?: (muid: number) => void;
  onMark?: (member: MemberI) => void;
}

const List: React.FC<ListProps> = (props) => {
  const { title, items, onMark, onDelete } = props;
  const ts = items.filter((m) => m.type === 'T');
  const tes = items.filter((m) => m.type === 'TE');
  const sorted = [...ts, ...tes];

  return (
    <Div className='list'>
      <h3 className='title'>{capitalize(title)} </h3>
      <div className='badge-container'>
        <span className='badge bg-warning m-1'>Ts: {ts.length}</span>
        <span className='badge bg-warning'>TEs: {tes.length}</span>
      </div>
      <ul className='list-group'>
        {sorted.map((item) => (
          <li className='list-group-item' key={item.muid}>
            {capitalize(item.name)} - {item.type}
            {onMark && onDelete && (
              <div>
                <span
                  className='badge m-2 bg-success'
                  onClick={() => onMark(item)}
                >
                  M
                </span>
                <span
                  className='badge bg-danger'
                  onClick={() => onDelete(item.muid)}
                >
                  X
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Div>
  );
};

const Div = styled.div`
  margin: 10px;
  position: relative;

  .title {
    font-size: clamp(1.2rem, 4vw, 1.75rem);
    padding: 5px;
    margin-bottom: 20px;
  }
  li {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  .badge-container {
    position: absolute;
    top: 35px;
    right: 1px;
  }
  .badge {
    font-size: 14px;
    cursor: pointer;
  }

  @media screen and (max-width: 679px) {
    .badge-container {
      top: 15px;
    }
  }

  @media print {
    .badge {
      border: none;
    }
  }
`;

export default List;
