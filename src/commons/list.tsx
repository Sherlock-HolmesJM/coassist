import { capitalize } from '../util';
import styled from 'styled-components';
import { MemberI } from '../components/members';

export interface ListProps {
  items: MemberI[];
  title: string;
  onDelete?: (name: string) => void;
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
          <li className='list-group-item' key={item.name}>
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
                  onClick={() => onDelete(item.name)}
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
    cursor: pointer;
  }

  @media print {
    .title {
      font-size: 1.2rem;
    }
  }
`;

export default List;
