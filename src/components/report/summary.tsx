import { MemberI, Worker } from '../../types';
import { getTeamCapacity } from '../../utils';
import { getWorkersCapacity } from '../../utils/worker';
import { Flex, FlexItem, Title } from './flex';

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
  const idw = getWorkersCapacity(issuedThisWeek);
  const rdw = getWorkersCapacity(returnedThisWeek);
  const ipw = getWorkersCapacity(issuedPreviousWeeks);

  return (
    <div>
      <Title>Summary</Title>
      <Flex>
        <FlexItem>
          <h5>Team's Capacity</h5>
          <div>Transcribers: {teamCapacity.ts}</div>
          <div>Transcript Editors: {teamCapacity.tes}</div>
        </FlexItem>
        <FlexItem>
          <h5>Issued and Returned</h5>
          <Flex>
            <FlexItem>
              <h5>Transcribers</h5>
              <div>
                Issued: {idw.tc} + {ipw.tc}
              </div>
              <div>Returned: {rdw.tc}</div>
            </FlexItem>
            <FlexItem>
              <h5>Transcript Editors</h5>
              <div>
                Issued: {idw.tec} + {ipw.tec}
              </div>
              <div>Returned: {rdw.tec}</div>
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    </div>
  );
};

export default Summary;
