import styled from 'styled-components';
import { puff } from '../media';

export interface LoaderProps {
  spin: boolean;
}

const Loader: React.FC<LoaderProps> = (props) => {
  const { spin } = props;

  if (!spin) return null;

  return (
    <Div>
      <img src={puff} alt='loader' />
    </Div>
  );
};

const Div = styled.div`
  position: fixed;
  top: 25px;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 70px;
  }
`;

export default Loader;
