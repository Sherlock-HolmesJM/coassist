import { useContext, useRef } from 'react';
import { context } from '../../context/context';
import { Worker } from '../../types';
import styled from 'styled-components';
import Summary from './summary';
import NotAllocated from './notAllocated';
import IssuedAndReturned from './issuedAndReturned';
import { Flex, Title } from './flex';
import SumCard from '../../commons/summaryCard';
import { checkDate, getWeekBegin, getWeekEnd } from '../../utils/date';
import { formatCap } from '../../utils/time';

export interface ReportProps {
  report: boolean;
  setReport: (value: boolean) => void;
}

const weekbegan = getWeekBegin('Sat');
const weekends = getWeekEnd(weekbegan);

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
    const isdw = m.workers.filter((w) =>
      checkDate(new Date(w.dateReceived), weekbegan, weekends)
    );
    const islw = m.workers.filter(
      (w) =>
        !w.done && !checkDate(new Date(w.dateReceived), weekbegan, weekends)
    );

    audinprog = [...audinprog, ...alist];
    audtrans = [...audtrans, ...alistT];
    transinprog = [...transinprog, ...tlist];
    transedited = [...transedited, ...tlistE];
    issuedDisWeek = [...issuedDisWeek, ...isdw];
    issuedPreviousWeeks = [...issuedPreviousWeeks, ...islw];
  });

  let returnedDisWeek = [];
  messages.forEach((m) => {
    const l = m.workers.filter(
      (w) => w.done && checkDate(new Date(w.dateReturned), weekbegan, weekends)
    );
    returnedDisWeek = [...returnedDisWeek, ...l];
  });

  let transcriptsNotAllocated = audtrans.filter(
    (m) => !transinprog.find((t) => t.part === m.part)
  );
  transcriptsNotAllocated = transcriptsNotAllocated.filter(
    (m) => !transedited.find((t) => t.part === m.part)
  );

  // ================== Animation =======================

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
      <div className='title-container'>
        <h4 className='uppercase title'>
          {groupName} weekly report - {collatorName}
        </h4>
        <h5>Week Began: {weekbegan.toDateString()}</h5>
        <h5>Week Ends: {new Date(weekends).toDateString()}</h5>
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
          {messagesInProgress.map((m, i) => {
            const totaltrans = m.workers
              .filter((m) => m.type === 'T' && m.done)
              .reduce((acc, m) => acc + m.splitLength || 0, 0);
            const totaledited = m.workers
              .filter((m) => m.type === 'TE' && m.done)
              .reduce((acc, m) => acc + m.splitLength || 0, 0);

            return (
              <SumCard
                key={i}
                title={m.name}
                items={[
                  ['Length', formatCap(m.duration)],
                  ['Transcribed', formatCap(totaltrans)],
                  ['Edited', formatCap(totaledited)],
                ]}
              />
            );
          })}
        </Flex>
      </div>
    </Div>
  );
};

const Div = styled.div`
  margin: 0;

  .btn-print-div {
    display: flex;
    justify-content: flex-end;
  }
  .title-container {
    text-align: center;
  }
  .title {
    margin-bottom: 40px;
  }
  .uppercase {
    text-transform: uppercase;
  }

  @media print {
    .no-print {
      display: none;
    }
  }
`;

export default Report;
