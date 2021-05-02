import { useContext, useRef } from 'react';
import { context } from '../../context/context';
import { Worker } from '../../types';
import styled from 'styled-components';
import {
  capitalize,
  getWeekBegin,
  getWeekEnd,
  getWorkCapacity,
} from '../../utils';
import Summary from './summary';
import NotAllocated from './notAllocated';
import IssuedAndReturned from './issuedAndReturned';
import { Flex, FlexDate, FlexItem, Title } from './flex';

export interface ReportProps {
  report: boolean;
  setReport: (value: boolean) => void;
}

const weekbegin_date = getWeekBegin('Sat');
const weekbegin = weekbegin_date.getTime();
const weekend = getWeekEnd(weekbegin_date).getTime();

const fallsInWeekBeginAndEnd = (date: Date) => {
  try {
    const tim = date.getTime();
    if (tim >= weekbegin && tim <= weekend) return true;
    return false;
  } catch (e) {
    return false;
  }
};

const Report: React.FC<ReportProps> = (props) => {
  const { messages, groupName, collatorName, members } = useContext(context);
  const { report, setReport } = props;

  const ref = useRef<HTMLDivElement>(null);

  if (!report) return null;

  const messagesNotAllocated = messages.filter((m) => m.status === 'undone');
  const messagesInProgress = messages.filter((m) => m.status === 'in-progress');

  let audtrans: Worker[] = []; // audios transcribed
  let audinprog: Worker[] = []; // audios in progress
  let transinprog: Worker[] = []; // transcripts in progress
  let transedited: Worker[] = []; // transcripts edited
  let issuedDisWeek: Worker[] = []; // audios/transcripts issued this week
  let issuedLastWeek: Worker[] = []; // audios/transcripts issued last week

  messagesInProgress.forEach((m) => {
    const alist = m.workers.filter((m) => m.type === 'T' && !m.done);
    const alistT = m.workers.filter((m) => m.type === 'T' && m.done);
    const tlist = m.workers.filter((m) => m.type === 'TE' && !m.done);
    const tlistE = m.workers.filter((m) => m.type === 'TE' && m.done);
    const isdw = m.workers.filter((w) =>
      fallsInWeekBeginAndEnd(new Date(w.dateReceived))
    );
    const islw = m.workers.filter(
      (w) => !fallsInWeekBeginAndEnd(new Date(w.dateReceived))
    );

    audinprog = [...audinprog, ...alist];
    audtrans = [...audtrans, ...alistT];
    transinprog = [...transinprog, ...tlist];
    transedited = [...transedited, ...tlistE];
    issuedDisWeek = [...issuedDisWeek, ...isdw];
    issuedLastWeek.concat(islw);
  });

  let returnedDisWeek = audtrans.filter((w) =>
    fallsInWeekBeginAndEnd(new Date(w.dateReturned))
  );
  returnedDisWeek = [
    ...returnedDisWeek,
    ...transedited.filter((w) =>
      fallsInWeekBeginAndEnd(new Date(w.dateReturned))
    ),
  ];

  let transcriptsNotAllocated = audtrans.filter(
    (m) => !transinprog.find((t) => t.part === m.part)
  );
  transcriptsNotAllocated = transcriptsNotAllocated.filter(
    (m) => !transedited.find((t) => t.part === m.part)
  );

  const len = {
    issuedDisWeek: getWorkCapacity(issuedDisWeek),
    returnedDisWeek: getWorkCapacity(returnedDisWeek),
    issuedLastWeek: getWorkCapacity(issuedLastWeek),
  };

  const getHMS = (duration: number) => {
    const h = Math.floor(duration / 60);
    const m = duration % 60;
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:00`;
  };

  const animIn = 'animate__zoomInDown';
  const animOut = 'animate__zoomOutLeft';

  const closeReport = () => {
    ref.current.classList.remove(animIn);
    ref.current.classList.add(animOut);
    setTimeout(() => setReport(false), 700);
  };

  return (
    <Div id='report' className={`animate__animated ${animIn}`} ref={ref}>
      <div className='no-print btn-print-div'>
        <button
          className='btn btn-primary btn-print'
          onClick={() => window.print()}
        >
          Get PDF
        </button>
        <button className='btn btn-primary btn-print' onClick={closeReport}>
          Close
        </button>
      </div>
      <div>
        <h4 className='uppercase title'>
          {groupName} weekly report - {collatorName}
        </h4>
      </div>
      <Summary members={members} len={len} />
      <IssuedAndReturned
        issued={issuedDisWeek}
        returned={returnedDisWeek}
        outstanding={issuedLastWeek}
      />
      <NotAllocated
        audios={messagesNotAllocated}
        transcripts={transcriptsNotAllocated}
      />
      <Item
        title='Free Team Members'
        list={members
          .filter((m) => m.active && m.free)
          .sort((a, b) => a.type.length - b.type.length)
          .map((m) => `${m.name} - ${m.type}`)}
      />
      <div>
        <Title>
          {messagesInProgress.length > 1 &&
            'Messages In Progress: Completion Rate'}
        </Title>
        <Flex>
          {messagesInProgress.map((m) => {
            const totaltrans = m.workers
              .filter((m) => m.type === 'T' && m.done)
              .reduce((acc, m) => acc + m.splitLength || 0, 0);
            const totaledited = m.workers
              .filter((m) => m.type === 'TE' && m.done)
              .reduce((acc, m) => acc + m.splitLength || 0, 0);

            return (
              <FlexItem key={m.uid} className='li'>
                <h6 className='list-title'>{m.name.toUpperCase()}</h6>
                <FlexDate>
                  <em>Total hours: {m.originalLength}</em>
                </FlexDate>
                <FlexDate>
                  <em>Total Hours Transcribed: {getHMS(totaltrans)}</em>
                </FlexDate>
                <FlexDate>
                  <em>Total Hours Edited: {getHMS(totaledited)}</em>
                </FlexDate>
              </FlexItem>
            );
          })}
        </Flex>
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
  overflow: auto;
  height: 80vh;
  padding: 10px;
  flex: 1;

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

  @media print {
    .no-print {
      display: none;
    }
  }
`;

export default Report;
