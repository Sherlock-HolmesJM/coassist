import styled from 'styled-components';
import { MemberI, MessageI, Worker } from '../../types';
import { Flex, FlexItem, Title } from './flex';

export interface NotAllocProps {
  audios: MessageI[];
  transcripts: Worker[];
  freemembers: MemberI[];
}

const NotAlloc: React.FC<NotAllocProps> = (props) => {
  const { audios, transcripts, freemembers } = props;

  const sortedAudios = audios.sort((a, b) => a.name.localeCompare(b.name));

  const sortedTranscripts = transcripts.sort((a, b) =>
    (a.part || a.name).localeCompare(b.part || b.name)
  );

  const audiolen = audios.length;
  const translen = transcripts.length;
  const memlen = freemembers.length;

  return (
    <Div>
      <Title>Not Allocated</Title>
      <Flex>
        <FlexItem>
          {audiolen > 0 && <h5>Audios - {audiolen}</h5>}
          {audiolen > 0 && (
            <div>
              {sortedAudios.map((m, i) => (
                <div key={i}>{m.name}</div>
              ))}
            </div>
          )}
        </FlexItem>
        <FlexItem>
          {translen > 0 && <h5>Transcripts - {translen}</h5>}
          {translen > 0 && (
            <div>
              {sortedTranscripts.map((m, i) => (
                <div key={i}>{m.part || m.name}</div>
              ))}
            </div>
          )}
        </FlexItem>
        <FlexItem>
          {memlen > 0 && <h5>Free Team Members - {memlen}</h5>}
          {memlen > 0 && (
            <div>
              {freemembers.map((m, i) => (
                <div key={i}>
                  {m.name} - {m.type}
                </div>
              ))}
            </div>
          )}
        </FlexItem>
      </Flex>
    </Div>
  );
};

const Div = styled.div``;

export default NotAlloc;
