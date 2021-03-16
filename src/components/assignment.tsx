import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { capitalize } from '../util';
import { context } from '../context/context';
import { setMessages, setMM } from '../context/actions';
import { MessageI } from '../types/member';

interface Props {}

function Assignment(props: Props) {
  const { dispatch, messages, members } = useContext(context);
  const [filename, setFilename] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const index = messages.findIndex((m) => m.name === filename);
    if (index !== -1)
      return alert(`${capitalize(filename)} is already being worked on.`);

    const message: MessageI = { name: filename, status: 'in-progress' };
    const newMessages = [...messages, message];

    dispatch(setMessages(newMessages));
    setFilename('');

    fileRef.current?.focus();
  };

  const handleDelete = (message: MessageI) => {
    const result = prompt('Are you sure?');
    if (result === null) return;
    const newMessages = messages.filter((m) => m.name !== message.name);

    if (message.status !== 'undone') {
      const newMembers = [...members];
      newMembers
        .filter((m) => m.works.find((w) => w.name === message.name))
        .forEach((wkr) => {
          wkr.works = wkr.works.filter((w) => w.name !== message.name);
        });
      dispatch(setMM(newMessages, newMembers));
    } else dispatch(setMessages(newMessages));
  };

  // const getStatus = (message: string) => {
  //   let workDone = 0;
  //   let totalWorks = 0;
  //   const workers = members.filter((m) =>
  //     m.works.find((w) => w.name === message)
  //   );
  //   workers.forEach((wkr) => {
  //     totalWorks = totalWorks + wkr.works.length;
  //     workDone = wkr.works.filter((w) => w.done).length + workDone;
  //   });
  //   if (totalWorks === workDone && workDone !== 0) return 'done';
  //   else if (totalWorks === 0) return 'undone';
  //   else return 'in-progress';
  // };

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
          {messages.map((m) => (
            <li key={m.name} className='list-group-item'>
              <Link to={`/assignments:${m.name}`} className='link'>
                {m.name} - <em>{m.status}</em>
              </Link>
              <span className='badge bg-danger' onClick={() => handleDelete(m)}>
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
