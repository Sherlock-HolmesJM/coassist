import styled from 'styled-components';
import Lottie from 'lottie-react';
import { loginBot } from '../media';
import { googleSignIn } from '../services/auth';

export interface Props {}

const Login: React.FC<Props> = (props) => {
  return (
    <Main>
      <Lottie className='mb-4 img-div' animationData={loginBot} />
      <h1 className='h3 mb-4 fw-normal'>Hello Collator...</h1>
      <div className='btn-group'>
        {/* <Link className='btn btn-primary' to='/home'>
          Sign-in-in
        </Link> */}
        <button className='btn btn-primary' onClick={googleSignIn}>
          Sign-in
        </button>
        {/* <button className='btn btn-outline-primary'>Sign-up</button> */}
      </div>
    </Main>
  );
};

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  background: black;

  .h3 {
    color: white;
  }
  .img-div {
    width: 250px;
  }
  .btn {
    text-transform: uppercase;
  }
`;

export default Login;
