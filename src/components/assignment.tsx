import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { capitalize } from '../util';
import { context } from '../context/context';
import { updateMessages } from '../context/actions';
import { MessageI } from './message/message';

interface Props {}

function Assignment(props: Props) {
  const { dispatch, messages } = useContext(context);
  const [filename, setFilename] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const list = Object.keys(messages);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (messages[filename])
      return alert(`${capitalize(filename)} is already being worked on.`);

    const message: MessageI = { filename, workers: [], status: 'in-progress' };
    const newMessages = { ...messages, [filename]: message };

    dispatch(updateMessages(newMessages));
    setFilename('');

    fileRef.current?.focus();
  };

  const handleDelete = (item: string) => {
    const result = prompt('Are you sure?');
    if (result === null) return;

    const newMessages = { ...messages };
    delete newMessages[item];

    dispatch(updateMessages(newMessages));
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
            value={filename}
            onChange={(e) => setFilename(e.target.value.toLowerCase())}
            required
            ref={fileRef}
          />
          <input className='btn btn-primary' type='submit' value='Add' />
        </form>
      </header>
      <main className='list-container'>
        <ul className='list-group'>
          {list.map((l) => (
            <li key={l} className='list-group-item'>
              <Link to={`/assignments:${l}`} className='link'>
                {l} - <em>{messages[l]?.status}</em>
              </Link>
              <span className='badge bg-danger' onClick={() => handleDelete(l)}>
                X
              </span>
            </li>
          ))}
        </ul>
      </main>
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

  .badge {
    float: right;
    cursor: pointer;
    color: white;
  }
  .list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .list-container > * {
    flex-basis: 400px;
  }
  .list-group-item {
    text-transform: uppercase;
  }
  .link {
    color: gray;
    text-decoration: none;
  }
  .link:visited {
    color: gray;
  }
`;

export default Assignment;
