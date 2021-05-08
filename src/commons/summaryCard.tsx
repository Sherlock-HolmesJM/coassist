import styled from 'styled-components';
import { FlexItem } from '../components/report/flex';

interface SumCardProps {
  title: string;
  items: [string, string][];
}

const SumCard: React.FC<SumCardProps> = (props) => {
  const { title, items } = props;

  return (
    <FlexItemWrap>
      <h6 className='card-title'>{title.toUpperCase()}</h6>
      {items.map((item, index) => (
        <div className='card-totals-container' key={index}>
          <em className='card-total'>{item[0]}</em>
          <em className='card-total'>{item[1]}</em>
        </div>
      ))}
    </FlexItemWrap>
  );
};

const FlexItemWrap = styled(FlexItem)`
  flex-grow: 0;
  background-color: #bdb6b6;
  border-bottom: 3px solid black;

  .card-title {
    text-transform: uppercase;
  }
  .card-totals-container {
    display: flex;
    justify-content: space-between;
    border-top: 2px solid gray;
    border-radius: 5px;
  }
  .card-total {
    display: block;
    text-transform: capitalize;
    padding: 5px 0;
  }
  .card-total:last-child {
    flex-basis: 52%;
    padding-left: 5px;
    text-align: left;
    border-left: 1px solid gray;
  }
`;

export default SumCard;
