import { useContext } from 'react';
import styled from 'styled-components';
import { context } from '../context/context';

interface Props {}

function Summary(props: Props) {
  const { messages } = useContext(context);

  const noAudios = messages.length;
  const noAudiosUN = messages.filter((m) => m.status === 'undone').length;
  const noAudiosDone = messages.filter((m) => m.status === 'done').length;
  const noAudiosIP = messages.filter((m) => m.status === 'in-progress').length;
  const noat = messages.filter((m) => m.transcribed).length;
  const noatn = messages.filter((m) => !m.transcribed).length;

  return (
    <Div>
      <h4 className='title'>Summary</h4>
      <div className='list'>
        <div className='item-1 item'>Total No. of Audios</div>
        <div className='item-2 item'>{noAudios}</div>
      </div>
      <div className='list'>
        <div className='item-1 item'>No. of Audios Issued</div>
        <div className='item-2 item'>{noAudiosIP + noAudiosDone}</div>
      </div>
      <div className='list'>
        <div className='item-1 item'>No. of Audios Transcribed</div>
        <div className='item-2 item'>{noat}</div>
      </div>
      <div className='list red'>
        <div className='item-1 item'>No. of Audios Not Transcribed</div>
        <div className='item-2 item'>{noatn}</div>
      </div>
      <div className='list'>
        <div className='item-1 item'>Total No. of Transcripts</div>
        <div className='item-2 item'>{noAudios}</div>
      </div>
      <div className='list'>
        <div className='item-1 item'>No. of Transcripts Issued</div>
        <div className='item-2 item'>{noAudiosIP + noAudiosDone}</div>
      </div>
      <div className='list'>
        <div className='item-1 item'>No. of Transcripts Edited</div>
        <div className='item-2 item'>{noAudiosDone}</div>
      </div>
      <div className='list red'>
        <div className='item-1 item'>No. of Transcripts Unedited</div>
        <div className='item-2 item'>{noAudiosUN + noAudiosIP}</div>
      </div>
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

  .title {
    text-align: center;
    background: purple;
    color: white;
    padding: 2px 0;
  }

  .list {
    display: flex;
    font-weight: 700;
    border-top: 1px solid purple;
  }
  .red {
    color: red;
  }
  .item-1 {
    flex-basis: 80%;
    text-align: right;
    padding: 2px 5px;
    border-right: 1px solid purple;
  }
  .item-2 {
    flex-basis: 20%;
    text-align: right;
    padding: 2px 5px;
  }
`;

export default Summary;
