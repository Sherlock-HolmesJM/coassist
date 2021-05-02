import styled from 'styled-components';
import { MemberI } from '../../types';
import { getTeamCapacity } from '../../utils';
import { Flex, FlexItem, Title } from './flex';

export interface SummaryProps {
  members: MemberI[];
  len: any;
}

const Summary: React.FC<SummaryProps> = (props) => {
  const { members, len } = props;
  const teamCapacity = getTeamCapacity(members);

  return (
    <Div>
      <Title>Summary</Title>
      <Flex>
        <FlexItem>
          <h5>Team's Capacity</h5>
          <div>Transcribers: {teamCapacity.ts}</div>
          <div>Transcript Editors: {teamCapacity.tes}</div>
        </FlexItem>
        <FlexItem>
          <h5>Issued and Returned</h5>
          <div>
            Issued: {len.issuedDisWeek} + {len.issuedLastWeek}
          </div>
          <div>Returned: {len.returnedDisWeek}</div>
        </FlexItem>
      </Flex>
    </Div>
  );
};

const Div = styled.div``;

export default Summary;
