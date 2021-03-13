import { capitalize } from "../util";
import styled from "styled-components";

export interface ListProps {
  items: string[];
  title: string;
}

const List: React.SFC<ListProps> = (props) => {
  const { title, items } = props;

  return (
    <Div>
      <h3 className="title">{capitalize(title)}</h3>
      <ul className="list-group">
        {items.map((item) => (
          <li className="list-group-item">
            {capitalize(item)}
            <div>
              <span className="badge m-2 bg-success">M</span>
              <span className="badge bg-danger">X</span>
            </div>
          </li>
        ))}
      </ul>
    </Div>
  );
};

const Div = styled.div`
  .title {
    font-size: clamp(1.2rem, 4vw, 1.75rem);
  }
  li {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }

  .badge {
    cursor: pointer;
  }
`;

export default List;
