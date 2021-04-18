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

  let audiosTranscribed: Worker[] = [];
  let audiosInProgress: Worker[] = [];
  let transcriptsInProgress: Worker[] = [];
  let transcriptsEdited: Worker[] = [];

  messagesInProgress.forEach((m) => {
    const alist = m.workers.filter((w) => w.type === 'T' && !w.done);
    const alistT = m.workers.filter((w) => w.type === 'T' && w.done);
    const tlist = m.workers.filter((w) => w.type === 'TE' && !w.done);
    const tlistE = m.workers.filter((w) => w.type === 'TE' && w.done);

    audiosInProgress = [...audiosInProgress, ...alist];
    audiosTranscribed = [...audiosTranscribed, ...alistT];
    transcriptsInProgress = [...transcriptsInProgress, ...tlist];
    transcriptsEdited = [...transcriptsEdited, ...tlistE];
  });

  let transcriptsNotAllocated = audiosTranscribed.filter(
    (w) => !transcriptsInProgress.find((t) => t.part === w.part)
  );
  transcriptsNotAllocated = transcriptsNotAllocated.filter(
    (w) => !transcriptsEdited.find((t) => t.part === w.part)
  );

  const getHMS = (duration: number) => {
    const h = Math.floor(duration / 60);
    const m = duration % 60;
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:00`;
  };

  return (
    <Div id='report'>
      <div className='no-print btn-print-div'>
        <button
          className='btn btn-primary btn-print'
          onClick={() => window.print()}
        >
          Get PDF
        </button>
      </div>
      <div>
        <h5 className='uppercase title'>
          {groupName} report - {collatorName}
        </h5>
      </div>
      <div>
        <h6 className='list-title'>Audios Not Transcribed, Not Allocated</h6>
        <ol>
          {messagesNotAllocated.map((m) => (
            <li key={m.uid}>
              <span className='uppercase'>{m.name}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h6 className='list-title'>Transcribed Splits Not Given To Editors</h6>
        <ol>
          {transcriptsNotAllocated.map((w) => (
            <li key={w.part}>
              <span className='uppercase'>
                {w.part} - {w.splitLength} Mins
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h5>DETAILS FOR THOSE IN-PROGRESS</h5>
        <ol>
          {messagesInProgress.map((m) => {
            const totaltrans = m.workers
              .filter((w) => w.type === 'T' && w.done)
              .reduce((acc, w) => acc + w.splitLength || 0, 0);
            const totaledited = m.workers
              .filter((w) => w.type === 'TE' && w.done)
              .reduce((acc, w) => acc + w.splitLength || 0, 0);

            return (
              <li key={m.uid} className='li'>
                <h6 className='list-title'>{m.name.toUpperCase()}</h6>
                <h6>Total hours: {m.originalLength}</h6>
                <h6>Total Hours Transcribed: {getHMS(totaltrans)}</h6>
                <h6>Total Hours Edited: {getHMS(totaledited)}</h6>
                <ol>
                  {m.workers
                    .filter((w) => !w.done)
                    .map((w) => (
                      <li key={w.uid}>
                        <span className='uppercase'>
                          {w.name} - {w.type}
                        </span>
                        <br />
                        <span>
                          {w.part.toUpperCase()}; {w.splitLength} Minutes;
                          Working
                        </span>
                      </li>
                    ))}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </Div>
  );
};

const Div = styled.div`
  .btn-print-div {
    display: flex;
    justify-content: flex-end;
  }
  .title {
    margin-bottom: 40px;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .ul-worker {
    text-transform: capitalize;
  }
  .li {
    margin: 15px 0;
  }
  /* .list-title {
    margin-top: 20px;
    margin-bottom: 20px;
  } */
  @media print {
    .no-print {
      display: none;
    }
  }
`;

export default Report;
