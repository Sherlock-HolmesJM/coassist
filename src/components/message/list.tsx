import styled from 'styled-components';
import { capitalize } from '../../util';
import { MemberI } from '../../types/member';

export interface ListProps {
  members: MemberI[];
  title: string;
  message: string;
  onDelete: (member: MemberI, part: string) => void;
  onMark: (member: MemberI, part: string) => void;
  onUpdate: (member: MemberI, part: string) => void;
}

const List: React.FC<ListProps> = (props) => {
  const { title, members, message, onMark, onDelete, onUpdate } = props;

  return (
    <Div className='list'>
      <h3 className='title'>{capitalize(title)} </h3>
      <ul className='list-group'>
        {members.map((member) => {
          const keys = Object.keys(member.works).filter((k) =>
            k.includes(message)
          );
          return keys.map((key) => {
            const { done } = member.works[key];
            return (
              <li className='list-group-item' key={key}>
                <div>
                  <div>
                    {capitalize(member.name)} - {member.type}:
                  </div>
                  <div>
                    <em>{key?.toUpperCase()}</em>
                  </div>
                </div>
                <div>
                  <span
                    className={`badge bg-${done ? 'success' : 'secondary'}`}
                    onClick={() => onMark(member, key)}
                  >
                    {done ? 'D' : 'IP'}
                  </span>
                  <span
                    className='badge bg-warning'
                    onClick={() => onUpdate(member, key)}
                  >
                    {!done && 'U'}
                  </span>
                  <span
                    className='badge bg-danger'
                    onClick={() => onDelete(member, key)}
                  >
                    X
                  </span>
                </div>
              </li>
            );
          });
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
