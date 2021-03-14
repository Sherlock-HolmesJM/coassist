import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, Redirect, useParams } from 'react-router-dom';

interface Props {
  list: string[];
}

function Message(props: Props) {
  const { list } = props;

  const [split, setSplit] = useState('');
  const splitRef = useRef<HTMLInputElement>(null);
  const messeage = useParams<{ slug: string }>().slug.replace(':', '');

  const index = list.indexOf(messeage);

  if (index === -1) return <Redirect to='/assignments' />;
  console.log('list', { index, list });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Section>
      <header className='header'>
        <nav className='nav'>
          <Link to='/home' className='btn btn-link'>
            Back
          </Link>
        </nav>
        <form onSubmit={handleSubmit} className='form'>
          <input
            className='form-control'
            type='text'
            placeholder='filename'
            value={split}
            onChange={(e) => setSplit(e.target.value.toLowerCase())}
            required
            ref={splitRef}
          />
          <input className='btn btn-primary' type='submit' value='Add' />
        </form>
      </header>
    </Section>
  );
}

const Section = styled.section`
  .header {
    display: flex;
    padding: 10px;
    margin: 10px;
    background: gray;
    flex-wrap: wrap;
  }
  .btn-link {
    color: white;
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .form-control {
    flex-basis: clamp(300px, 50%, 400px);
    text-transform: capitalize;
    border: 2px gray red;
  }
`;

export default Message;
