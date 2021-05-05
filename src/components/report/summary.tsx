import SumCard from '../../commons/summaryCard';
import { MemberI, Worker } from '../../types';
import { getTeamCapacity } from '../../utils';
import { getWorkersCapacity } from '../../utils/worker';
import { Flex, Title } from './flex';

export interface SummaryProps {
  members: MemberI[];
  issuedThisWeek: Worker[];
  issuedPreviousWeeks: Worker[];
  returnedThisWeek: Worker[];
}

const Summary: React.FC<SummaryProps> = (props) => {
  const {
    members,
    issuedPreviousWeeks,
    issuedThisWeek,
    returnedThisWeek,
  } = props;

  const teamCapacity = getTeamCapacity(members);
  const idw = getWorkersCapacity(issuedThisWeek); // idw: issued this week
  const rdw = getWorkersCapacity(returnedThisWeek); // rdw: returned this week
  const ipw = getWorkersCapacity(issuedPreviousWeeks); // ipw: issued previous week(s)

  return (
    <div>
      <Title>Summary</Title>
      <Flex>
        <SumCard
          title={`Team's Capacity`}
          items={[
            ['Transcribers', teamCapacity.ts],
            ['Transcript Editors', teamCapacity.tes],
          ]}
        />
        <SumCard
          title={`Transcribers`}
          items={[
            ['Issued', `${idw.tc} + ${ipw.tc}`],
            ['Returned', `${rdw.tc}`],
          ]}
        />
        <SumCard
          title={`Transcript Editors`}
          items={[
            ['Issued', `${idw.tec} + ${ipw.tec}`],
            ['Returned', `${rdw.tec}`],
          ]}
        />
      </Flex>
    </div>
  );
};

export default Summary;
