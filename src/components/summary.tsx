import { useContext } from 'react';
import styled from 'styled-components';
import { context } from '../context/context';

interface Props {}

function Summary(props: Props) {
  const { messages } = useContext(context);

  const total = messages.length;
  const undone = messages.filter((m) => m.status === 'undone').length;
  const done = messages.filter((m) => m.status === 'done').length;
  const inProgress = messages.filter((m) => m.status === 'in-progress').length;
  const transcribed = messages.filter((m) => m.transcribed).length;
  const notTranscribed = messages.filter((m) => !m.transcribed).length;

  const items = [
    { name: 'Total No. of Audios', value: total, className: '' },
    { name: 'No. of Audios Issued', value: inProgress, className: '' },
    { name: 'No. of Audios Transcribed', value: transcribed, className: '' },
    {
      name: 'No. of Audios Not Transcribed',
      value: notTranscribed,
      className: 'summary-red',
    },
    { name: 'Total No. of Transcripts', value: total, className: '' },
    { name: 'No. of Transcripts Issued', value: inProgress, className: '' },
    { name: 'No. of Transcripts Edited', value: done, className: '' },
    {
      name: 'No. of Transcripts Not Edited',
      value: inProgress + undone,
      className: 'summary-red',
    },
  ];

  return (
    <Div>
      <h4 className='summary-title'>Summary</h4>
      {items.map((item, i) => (
        <div key={i} className={'summary-list ' + item.className}>
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
