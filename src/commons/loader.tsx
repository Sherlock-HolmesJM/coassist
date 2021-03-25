import styled from 'styled-components';
import { puff } from '../media';

export interface LoaderProps {
  spin: boolean;
}

const Loader: React.FC<LoaderProps> = (props) => {
  const { spin } = props;

  return (
    <Div style={{ display: spin ? 'block' : 'none' }}>
      <img src={puff} alt='loader' />
    </Div>
  );
};

const Div = styled.div`
  position: absolute;

  img {
    width: 110px;
  }
`;

export default Loader;
