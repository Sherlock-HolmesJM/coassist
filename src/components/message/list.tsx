import styled from 'styled-components';
import { capitalize } from '../../util';
import { MemberI } from '../../types/member';

export interface ListProps {
  members: MemberI[];
  title: string;
  done: boolean;
  message: string;
  onDelete: (member: MemberI, part: string) => void;
  onMark: (member: MemberI, part: string) => void;
  onUpdate: (member: MemberI, part: string) => void;
}

const List: React.FC<ListProps> = (props) => {
  const { title, message, done, members, onMark, onDelete, onUpdate } = props;

  return (
    <Div className='list'>
      <h3 className='title'>{capitalize(title)} </h3>
      <ul className='list-group'>
        {members.map((member) => {
          return member.works
            .filter((w) => w.done === done && w.name === message)
            .map((work) => {
              return (
                <li className='list-group-item' key={work.part}>
                  <div>
                    <div>
                      {capitalize(member.name)} - {member.type}:
                    </div>
                    <div>
                      <em>{work.part.toUpperCase()}</em>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`badge bg-${
                        work.done ? 'success' : 'secondary'
                      }`}
                      onClick={() => onMark(member, work.part)}
                    >
                      {work.done ? 'D' : 'IP'}
                    </span>
                    <span
                      className='badge bg-warning'
                      onClick={() => onUpdate(member, work.part)}
                    >
                      {!work.done && 'U'}
                    </span>
                    <span
                      className='badge bg-danger'
                      onClick={() => onDelete(member, work.part)}
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
