import styled from 'styled-components';
import { capitalize } from '../../util';
import { MemberI } from '../../components/members';

export interface ListProps {
  items: MemberI[];
  title: string;
  onDelete: (name: string) => void;
  onMark: (member: MemberI) => void;
  onUpdate: (member: MemberI) => void;
}

const List: React.FC<ListProps> = (props) => {
  const { title, items, onMark, onDelete, onUpdate } = props;

  return (
    <Div className='list'>
      <h3 className='title'>{capitalize(title)} </h3>
      <ul className='list-group'>
        {items.map((item) => (
          <li className='list-group-item' key={item.name}>
            <div>
              <div>
                {capitalize(item.name)} - {item.type}:
              </div>
              <div>
                <em>{item.work?.toUpperCase()}</em>
              </div>
            </div>
            <div>
              <span className='badge bg-success' onClick={() => onMark(item)}>
                M
              </span>
              <span className='badge bg-warning' onClick={() => onUpdate(item)}>
                U
              </span>
              <span
                className='badge bg-danger'
                onClick={() => onDelete(item.name)}
              >
                X
              </span>
            </div>
          </li>
        ))}
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
    margin: 2px;
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
