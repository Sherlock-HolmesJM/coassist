import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2em;
  margin: 2em 0;
`;

export const FlexItem = styled.div`
  min-width: 290px;
  flex-basis: calc(calc(500px - 100%) * 999);
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px inset gray;
  & * {
    text-transform: uppercase;
  }
`;

export const FlexDate = styled.div`
  font-size: 13px;
  font-weight: 650;
`;

export const Title = styled.h5`
  margin-bottom: 5px;
  text-decoration: underline 1.4px gray solid;
  text-align: center;
`;
