import { useContext } from 'react';
import styled from 'styled-components';
import { context } from '../context/context';

interface Props {}

function Summary(props: Props) {
  const { messages } = useContext(context);

  const total = messages.length;

  const tIP = messages.filter((m) => m.edited === 'in-progress').length;
  const tEdited = messages.filter((m) => m.edited === 'yes').length;

  const aTrans = messages.filter((m) => m.transcribed === 'yes').length;
  const aIP = messages.filter((m) => m.transcribed === 'in-progress').length;

  const items = [
    { name: 'Total No. of Audios', value: total, classes: '' },
    { name: 'No. of Audios Issued', value: aTrans + aIP, classes: '' },
    { name: 'No. of Audios Transcribed', value: aTrans, classes: '' },
    {
      name: 'No. of Audios Not Transcribed',
      value: total - aTrans,
      classes: 'summary-red',
    },
    { name: 'Total No. of Transcripts', value: total, classes: '' },
    {
      name: 'No. of Transcripts Issued',
      value: tIP + tEdited,
      classes: '',
    },
    { name: 'No. of Transcripts Edited', value: tEdited, classes: '' },
    {
      name: 'No. of Transcripts Not Edited',
      value: total - tEdited,
      classes: 'summary-red',
    },
  ];

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

  width: 310px;
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
