import { useContext } from 'react';
import styled from 'styled-components';
import { context } from '../context/context';
import { summary } from '../utils';

// interface Props {}

function Summary() {
  const { messages } = useContext(context);
  const items = summary(messages);

  return (
    <Div className='no-print'>
      <h4 className='summary-title'>Summary</h4>
      {items.map((item, i) => (
        <div key={i} className={'summary-list ' + item.classes}>
          <div className='summary-item-1'>{item.name}</div>
          <div className='summary-item-2'>{item.value}</div>
        </div>
      ))}
    </Div>
  );
}

const Div = styled.div`
  * {
    margin: 0;
  }

  width: min(90vw, 310px);
  margin-bottom: 20px;
  border: 1px solid purple;
  align-self: baseline;

  .summary-title {
    text-align: center;
    background: purple;
    color: white;
    padding: 2px 0;
  }
  .summary-list {
    display: flex;
    font-weight: 700;
    border-top: 1px solid purple;
    font-size: max(0.9rem, 1.2vw);
  }
  .summary-red {
    color: red;
  }
  .summary-item-1 {
    flex-basis: 80%;
    text-align: right;
    padding: 2px 5px;
    border-right: 1px solid purple;
  }
  .summary-item-2 {
    flex-basis: 20%;
    text-align: right;
    padding: 2px 5px;
  }
`;

export default Summary;
