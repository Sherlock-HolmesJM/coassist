import { useContext } from 'react';
import { context } from '../context/context';
import { Worker } from '../types';
import styled from 'styled-components';

export interface ReportProps {
  report: boolean;
}

const Report: React.FC<ReportProps> = (props: ReportProps) => {
  const { messages, groupName, collatorName } = useContext(context);

  if (!props.report) return null;

  const messagesNotAllocated = messages.filter((m) => m.status === 'undone');
  const messagesInProgress = messages.filter((m) => m.status === 'in-progress');
  let audiosInProgress: Worker[] = [];
  let transcriptsInProgress: Worker[] = [];

  messagesInProgress.forEach((m) => {
    const alist = m.workers.filter((w) => w.type === 'T' && !w.done);
    const tlist = m.workers.filter((w) => w.type === 'TE' && !w.done);
    audiosInProgress = [...audiosInProgress, ...alist];
    transcriptsInProgress = [...transcriptsInProgress, ...tlist];
  });

  return (
    <Div>
      <div>
        <h5 className='uppercase title'>
          {groupName} report - {collatorName}
        </h5>
        <h6 className='list-title'>Transcripts Being Edited</h6>
        <ol>
          {transcriptsInProgress.map((w) => (
            <li>
              <span className='uppercase'>{w.part}</span> --&gt;{' '}
              <span className='ul-worker'>{w.name}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h6 className='list-title'>Audios Being Transcribed</h6>
        <ol>
          {audiosInProgress.map((w) => (
            <li>
              <span className='uppercase'>{w.part}</span> --&gt;{' '}
              <span className='ul-worker'>{w.name}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h6 className='list-title'>Audios Not Allocated</h6>
        <ol>
          {messagesNotAllocated.map((m) => (
            <li>
              <span className='uppercase'>{m.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </Div>
  );
};

const Div = styled.div`
  .title {
    margin-bottom: 40px;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .ul-worker {
    text-transform: capitalize;
  }
  .list-title {
    margin-top: 40px;
    margin-bottom: 20px;
  }
`;

export default Report;
