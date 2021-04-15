import styled from 'styled-components';
import { puff } from '../media';

export interface LoaderProps {
  spin: boolean;
}

const Loader: React.FC<LoaderProps> = (props) => {
  const { spin } = props;

  return (
    <Div style={{ display: spin ? 'flex' : 'none' }}>
      <img src={puff} alt='loader' />
    </Div>
  );
};

const Div = styled.div`
  position: fixed;
  top: 25px;
  width: 100%;
  height: 70px;
  justify-content: center;
  align-items: center;

  img {
    width: 70px;
  }
`;

export default Loader;
