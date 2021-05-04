import { useContext, useRef } from 'react';
import { context } from '../../context/context';
import { Worker } from '../../types';
import styled from 'styled-components';
import { formatCap, getWeekBegin, getWeekEnd } from '../../utils';
import Summary from './summary';
import NotAllocated from './notAllocated';
import IssuedAndReturned from './issuedAndReturned';
import { Flex, FlexItem, Title } from './flex';

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
  let issuedPreviousWeeks: Worker[] = []; // audios/transcripts issued last week

  messagesInProgress.forEach((m) => {
    const alist = m.workers.filter((m) => m.type === 'T' && !m.done);
    const alistT = m.workers.filter((m) => m.type === 'T' && m.done);
    const tlist = m.workers.filter((m) => m.type === 'TE' && !m.done);
    const tlistE = m.workers.filter((m) => m.type === 'TE' && m.done);
    const isdw = m.workers.filter(
      (w) => !w.done && fallsInWeekBeginAndEnd(new Date(w.dateReceived))
    );
    const islw = m.workers.filter(
      (w) => !w.done && !fallsInWeekBeginAndEnd(new Date(w.dateReceived))
    );

    audinprog = [...audinprog, ...alist];
    audtrans = [...audtrans, ...alistT];
    transinprog = [...transinprog, ...tlist];
    transedited = [...transedited, ...tlistE];
    issuedDisWeek = [...issuedDisWeek, ...isdw];
    issuedPreviousWeeks = [...issuedPreviousWeeks, ...islw];
  });

  let returnedDisWeek = audtrans.filter((w) =>
    fallsInWeekBeginAndEnd(w.done && new Date(w.dateReturned))
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
        <h5>Week Began: {weekbegin_date.toDateString()}</h5>
        <h5>Week Ends: {new Date(weekend).toDateString()}</h5>
      </div>
      <Summary
        members={members}
        issuedPreviousWeeks={issuedPreviousWeeks}
        issuedThisWeek={issuedDisWeek}
        returnedThisWeek={returnedDisWeek}
      />
      <IssuedAndReturned
        issued={issuedDisWeek}
        returned={returnedDisWeek}
        outstanding={issuedPreviousWeeks}
      />
      <NotAllocated
        audios={messagesNotAllocated}
        transcripts={transcriptsNotAllocated}
        freemembers={members
          .filter((m) => m.active && m.free)
          .sort((a, b) => a.type.length - b.type.length)}
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
                <div className='li-totals'>
                  <em className='li-total'>Length</em>
                  <em className='li-total'>{formatCap(m.duration)}</em>
                </div>
                <div className='li-totals'>
                  <em className='li-total'>Transcribed</em>
                  <em className='li-total'>{formatCap(totaltrans)}</em>
                </div>
                <div className='li-totals'>
                  <em className='li-total'>Edited</em>
                  <em className='li-total'>{formatCap(totaledited)}</em>
                </div>
              </FlexItem>
            );
          })}
        </Flex>
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
  .li {
    background-color: #bdb6b6;
    border-radius: 0.5em;
  }
  .li-totals {
    display: flex;
    justify-content: space-between;
    border-top: 2px solid gray;
    padding: 3px;
    border-radius: 5px;
  }
  .li-total {
    display: block;
  }
  .li-total:last-child {
    flex-basis: 50%;
    padding-left: 5px;
    text-align: left;
    border-left: 1px solid gray;
  }
  @media print {
    .no-print {
      display: none;
    }
  }
`;

export default Report;
