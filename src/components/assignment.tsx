import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { capitalize } from '../util';
import { context } from '../context/context';
import { setMessages, setMM } from '../context/actions';
import { MessageI } from '../types/member';
import { db } from '../services';
import { getMemberStatus } from './message/messageModel';

interface Props {}

function Assignment(props: Props) {
  const { dispatch, messages, members } = useContext(context);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filename = fileRef.current?.value.toLowerCase().trim() ?? '';
    const index = messages.findIndex((m) => m.name === filename);
    if (index !== -1)
      return alert(`${capitalize(filename)} is already being worked on.`);

    const message: MessageI = {
      muid: Date.now(),
      name: filename,
      status: 'undone',
      workers: [],
    };
    const newMessages = [...messages, message];

    dispatch(setMessages(newMessages));
    fileRef.current?.focus();
    if (fileRef.current) fileRef.current.value = '';
    db.setMessage(message);
  };

  const handleDelete = (message: MessageI) => {
    const result = prompt('Are you sure?');
    if (result === null) return;
    const newMessages = messages.filter((m) => m.name !== message.name);

    if (message.status === 'undone') {
      dispatch(setMessages(newMessages));
    } else {
      const newMembers = [...members];
      newMembers.forEach((mem) => {
        mem.free = getMemberStatus(mem.muid, newMessages);
      });

      dispatch(setMM(newMessages, newMembers));
      db.updateMembers(newMembers);
    }

    db.removeMessage(message.muid);
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
            required
            ref={fileRef}
          />
          <input className='btn btn-primary' type='submit' value='Add' />
        </form>
      </header>
      <main className='list-container'>
        <ul className='list-group'>
          {messages
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((m) => (
              <li key={m.name} className='list-group-item'>
                <Link to={`/assignments:${m.name}`} className='link'>
                  {m.name} - <em>{m.status}</em>
                </Link>
                <span
                  className='badge bg-danger'
                  onClick={() => handleDelete(m)}
                >
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
    flex-basis: clamp(310px, 50%, 400px);
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
    padding: 10px;
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
