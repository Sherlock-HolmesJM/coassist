import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { errorBot } from '../media';
import { signOut } from '../services/auth';
import Lottie from 'lottie-react';

interface Props {}

function Error(props: Props) {
  return (
    <Div>
      <Link to='/' onClick={signOut} className='btn btn-outline-success'>
        Back
      </Link>
      <Lottie className='mb-4 img-div' animationData={errorBot} />
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: black;
  min-width: 100vw;
  min-height: 100vh;

  .img-div {
    width: clamp(600px, 90%, 1000px);
  }
  .btn {
    margin: 10px;
    color: white;
  }
`;

export default Error;
