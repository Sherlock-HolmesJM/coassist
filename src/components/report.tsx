import { useContext } from 'react';
import { context } from '../context/context';
import { Worker } from '../types';
import styled from 'styled-components';
import { capitalize } from '../utils';

export interface ReportProps {
  report: boolean;
}

const Report: React.FC<ReportProps> = (props: ReportProps) => {
  const { messages, groupName, collatorName, members } = useContext(context);

  if (!props.report) return null;

  const messagesNotAllocated = messages.filter((m) => m.status === 'undone');
  const messagesInProgress = messages.filter((m) => m.status === 'in-progress');

  let audiosTranscribed: Worker[] = [];
  let audiosInProgress: Worker[] = [];
  let transcriptsInProgress: Worker[] = [];
  let transcriptsEdited: Worker[] = [];

  messagesInProgress.forEach((m) => {
    const alist = m.workers.filter((m) => m.type === 'T' && !m.done);
    const alistT = m.workers.filter((m) => m.type === 'T' && m.done);
    const tlist = m.workers.filter((m) => m.type === 'TE' && !m.done);
    const tlistE = m.workers.filter((m) => m.type === 'TE' && m.done);

    audiosInProgress = [...audiosInProgress, ...alist];
    audiosTranscribed = [...audiosTranscribed, ...alistT];
    transcriptsInProgress = [...transcriptsInProgress, ...tlist];
    transcriptsEdited = [...transcriptsEdited, ...tlistE];
  });

  let transcriptsNotAllocated = audiosTranscribed.filter(
    (m) => !transcriptsInProgress.find((t) => t.part === m.part)
  );
  transcriptsNotAllocated = transcriptsNotAllocated.filter(
    (m) => !transcriptsEdited.find((t) => t.part === m.part)
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
      <Item
        title='Free Team Members'
        list={members
          .filter((m) => m.active && m.free)
          .sort((a, b) => a.type.length - b.type.length)
          .map((m) => `${m.name} - ${m.type}`)}
      />
      <Item
        title='Audios Not Transcribed, Not Allocated'
        list={messagesNotAllocated.map((m) => m.name)}
      />
      <Item
        title='Transcribed Splits Not Given To Editors'
        list={transcriptsNotAllocated.map(
          (m) => `${m.part} - ${m.splitLength}min`
        )}
      />
      <Item
        title='Messages In Progress'
        list={messagesInProgress.map((m) => m.name)}
      />
      <div>
        <h5>
          {messagesInProgress.length > 1 && 'DETAILS FOR THOSE IN-PROGRESS'}
        </h5>
        <ol>
          {messagesInProgress.map((m) => {
            const totaltrans = m.workers
              .filter((m) => m.type === 'T' && m.done)
              .reduce((acc, m) => acc + m.splitLength || 0, 0);
            const totaledited = m.workers
              .filter((m) => m.type === 'TE' && m.done)
              .reduce((acc, m) => acc + m.splitLength || 0, 0);

            return (
              <li key={m.uid} className='li'>
                <h6 className='list-title'>{m.name.toUpperCase()}</h6>
                <h6>Total hours: {m.originalLength}</h6>
                <h6>Total Hours Transcribed: {getHMS(totaltrans)}</h6>
                <h6>Total Hours Edited: {getHMS(totaledited)}</h6>
                <ol>
                  {m.workers
                    .filter((m) => !m.done)
                    .map((m) => (
                      <li key={m.uid}>
                        <span className='uppercase'>
                          {m.name} - {m.type}
                        </span>
                        <br />
                        <span>
                          {m.part.toUpperCase()}; {m.splitLength} Minutes;
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

interface ItemProps {
  title: string;
  list: string[];
}

const Item = (props: ItemProps) => {
  const { title, list } = props;

  if (list.length === 0)
    return <h6 className='list-title'>No {capitalize(title)}</h6>;

  return (
    <div>
      <h6 className='list-title'>{capitalize(title)}</h6>
      <ol>
        {list.map((l, i) => (
          <li key={i}>
            <span className='uppercase'>{l}</span>
          </li>
        ))}
      </ol>
    </div>
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
