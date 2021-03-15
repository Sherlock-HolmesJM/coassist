import { useState } from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import { loginBot } from '../media';
import { googleSignIn } from '../services/auth';
import { Redirect } from 'react-router-dom';

export interface Props {}

const Login: React.FC<Props> = (props) => {
  const [red, setRed] = useState(false);

  firebase.auth().onAuthStateChanged((user) => user && setRed(true));

  if (red) return <Redirect to='/home' />;

  return (
    <Main>
      <Lottie className='mb-4 img-div' animationData={loginBot} />
      <h1 className='h3 mb-4 fw-normal'>Hello...</h1>
      <div className='btn-group'>
        <button onClick={googleSignIn} className='btn btn-primary'>
          Sign-in
        </button>
        <button className='btn btn-outline-primary'>Sign-up</button>
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
