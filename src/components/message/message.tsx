import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { context } from '../../context/context';
import { setMembers } from '../../context/actions';
import List from './list';
import { MemberI, Work } from '../../types/member';
import { capitalize } from '../../util';

interface Props {}

export interface MessageI {
  name: string;
  status: 'in-progress' | 'done';
}

function Message(props: Props) {
  const { members, dispatch, messages } = useContext(context);
  const message = useParams<{ slug: string }>().slug.replace(':', '');

  const [split, setSplit] = useState('');
  const [nameWorker, setNameWorker] = useState('');

  const filename = message + '-';

  const freeMembers = Object.entries(members)
    .filter((m) => m[1].status === 'active' && m[1].free)
    .reduce((a: MemberI[], n) => [...a, n[1]], []);

  const workers = Object.entries(members)
    .filter((m) => {
      const keys = Object.keys(m[1].works);
      return keys.find((k) => k.includes(message)) !== undefined;
    })
    .reduce((a: MemberI[], n) => [...a, n[1]], []);

  useEffect(() => {
    setSplit(filename);
  }, [filename]);

  useEffect(() => {
    freeMembers[0] && setNameWorker(freeMembers[0].name);
    // eslint-disable-next-line
  }, [freeMembers.length]);

  if (!messages[message]) return <Redirect to='/assignments' />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = freeMembers.find((w) => w.name === nameWorker);
    if (!worker) return;

    const workName = getWork();
    const w = workers.find((w) => w.works[workName]);
    if (w) {
      if (w.works[workName]?.done)
        alert(
          `${capitalize(w.name)} is done working on this file - ${workName}`
        );
      else
        alert(
          `${capitalize(w.name)} is already working on this file - ${workName}`
        );
      return;
    }
    const work: Work = { name: workName, done: false };
    const newWorker = {
      ...worker,
      works: { ...worker.works, [work.name]: work },
      free: false,
    };
    const newMembers = { ...members, [worker.name]: newWorker };
    dispatch(setMembers(newMembers));
  };

  const handleMark = (member: MemberI, part: string) => {
    const newWorker = { ...member, free: !member.free };
    newWorker.works[part].done = !newWorker.works[part].done;

    const newMembers = { ...members, [member.name]: newWorker };
    dispatch(setMembers(newMembers));
  };

  const handleDelete = (member: MemberI, part: string) => {
    const newMember = { ...member, free: true };
    delete newMember.works[part];
    const newMembers = { ...members, [member.name]: newMember };

    dispatch(setMembers(newMembers));
  };

  const handleUpdate = (member: MemberI, part: string) => {
    const newMember: MemberI = { ...member };
    newMember.works[part].name = getWork();

    const newMembers = { ...members, [member.name]: newMember };
    dispatch(setMembers(newMembers));
  };

  const getWork = () => (parseInput(split) === '' ? message : split);
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
            required
            className='form-select'
            onChange={(e) => setNameWorker(e.target.value)}
          >
            {freeMembers.map((m, i) => (
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
          members={workers}
          title='workers'
          message={message}
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
