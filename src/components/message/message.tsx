import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { context } from '../../context/context';
import { setMembers, updateMessages } from '../../context/actions';
import List from './list';
import { MemberI } from '../members';

interface Props {}

export interface MessageI {
  filename: string;
  workers: MemberI[];
  status: 'in-progress' | 'done';
}

function Message(props: Props) {
  const { members, dispatch, messages } = useContext(context);
  const message = useParams<{ slug: string }>().slug.replace(':', '');

  const filename = message + '-';
  const freeWorkers = members.filter((m) => m.work === null);

  const [split, setSplit] = useState('');
  const [workers, setWorkers] = useState<MemberI[]>([]);
  const [nameWorker, setNameWorker] = useState('');

  useEffect(() => {
    setSplit(filename);
    freeWorkers[0] && setNameWorker(freeWorkers[0].name);
    const workers = messages[message]?.workers;
    if (workers) setWorkers(workers);
    // eslint-disable-next-line
  }, [filename, message]);

  if (!messages[message]) return <Redirect to='/assignments' />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = freeWorkers.find((w) => w.name === nameWorker);
    if (!result) return;

    const member = { ...result, work: split };
    const newMembers = members.filter((m) => m.name !== member.name);
    newMembers.push(member);

    const newMessages = { ...messages };
    newMessages[message].workers.push(member);

    dispatch(updateMessages(newMessages));
    dispatch(setMembers(newMembers));
  };

  const handleMark = () => {};
  const handleDelete = () => {};

  const handleUpdate = () => {};

  const parseInput = (value: string) =>
    value.slice(filename.length, value.length);

  return (
    <Section>
      <header className='header'>
        <nav className='nav'>
          <Link to='/assignments' className='btn btn-link'>
            Back
          </Link>
        </nav>
        <form onSubmit={handleSubmit} className='form'>
          <input
            className='form-control'
            type='text'
            placeholder='filename'
            value={split}
            onChange={(e) => setSplit(filename + parseInput(e.target.value))}
            required
          />
          <select
            name='type'
            id='type'
            required
            className='form-select'
            onChange={(e) => setNameWorker(e.target.value)}
          >
            {freeWorkers.map((m, i) => (
              <option key={i} value={m.name}>
                {`${m.name.toUpperCase()} - ${m.type}`}
              </option>
            ))}
          </select>
          <input className='btn btn-primary' type='submit' value='Add' />
        </form>
      </header>
      <div className='container'>
        <List
          items={workers}
          title='workers'
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onMark={handleMark}
        />
      </div>
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
  .container > * {
    flex-basis: 400px;
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .form-control {
    flex-basis: clamp(220px, 30%, 270px);
    text-transform: uppercase;
    border: 2px gray red;
  }
`;

export default Message;
