import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 10px 5px;
`;

export const FlexItem = styled.div`
  padding: 5px;
  border: 1px inset gray;
  & * {
    text-transform: uppercase;
  }
`;

export const FlexDate = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

export const Title = styled.h5`
  margin-bottom: 5px;
  text-decoration: underline 1.4px gray solid;
  text-align: center;
`;
