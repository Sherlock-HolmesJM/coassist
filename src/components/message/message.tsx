import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { context } from '../../context/context';
import { setMM } from '../../context/actions';
import List from './list';
import { MemberI, Work } from '../../types/member';
import { checkWork, getWorkers } from './messageModel';
import { db } from '../../services';

interface Props {}

function Message(props: Props) {
  const { members, dispatch, messages } = useContext(context);
  const message = useParams<{ slug: string }>().slug.replace(':', '');
  const [split, setSplit] = useState('');
  const [nameWorker, setNameWorker] = useState('');

  const filename = message + '-';
  const freeMembers = members.filter((m) => m.active && m.free);
  const workers = getWorkers(members, message);
  const getFirstWorker = () => freeMembers[0];

  useEffect(() => {
    setSplit(filename);
  }, [filename]);

  useEffect(() => {
    const w = getFirstWorker();
    if (w) setNameWorker(w.name);
    // eslint-disable-next-line
  }, [freeMembers.length]);

  console.log(nameWorker);

  const index = messages.findIndex((m) => m.name === message);
  if (index === -1) return <Redirect to='/assignments' />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = freeMembers.find((w) => w.name === nameWorker);
    if (!worker) return;

    const workName = getWork();
    if (checkWork(workers, workName, worker.type)) return;
    const work: Work = { name: message, part: workName, done: false };
    const newWorker: MemberI = {
      ...worker,
      works: [...worker.works, work],
      free: false,
    };
    update(members, newWorker);
    db.updateMember(newWorker);
  };

  const handleMark = (member: MemberI, part: string) => {
    const newWorker = { ...member, free: !member.free };
    let index = newWorker.works.findIndex((w) => w.part === part);
    newWorker.works[index].done = !newWorker.works[index].done;
    update(members, newWorker);
    db.updateMember(newWorker);
  };

  const handleDelete = (member: MemberI, part: string) => {
    const newWorker = { ...member, free: true };
    newWorker.works = newWorker.works.filter((w) => w.part !== part);
    update(members, newWorker);
    db.updateMember(newWorker);
  };

  const handleUpdate = (member: MemberI, part: string) => {
    const workName = getWork();
    if (checkWork(workers, workName, member.type)) return;
    const newWorker = { ...member };
    let index = newWorker.works.findIndex((w) => w.part === part);
    newWorker.works[index].part = workName;
    update(members, newWorker);
    db.updateMember(newWorker);
  };

  const update = (members: MemberI[], newMember: MemberI) => {
    const newMembers = [...members];
    const index = newMembers.findIndex((m) => m.name === newMember.name);
    newMembers[index] = newMember;
    dispatch(setMM(updateMsgStatus(newMembers), newMembers));
  };

  const updateMsgStatus = (members: MemberI[]) => {
    const newMsgs = [...messages];
    const m = newMsgs.find((m) => m.name === message);

    if (!m) return newMsgs;

    const workers = getWorkers(members, message);
    const totalWorks = workers.reduce(
      (a, wkr) => a + wkr.works.filter((w) => w.name === message).length,
      0
    );
    const workDone = workers.reduce(
      (a, wkr) =>
        a + wkr.works.filter((w) => w.name === message && w.done).length,
      0
    );

    if (totalWorks === workDone && workDone !== 0) m.status = 'done';
    else if (totalWorks === workDone && workDone === 0) m.status = 'undone';
    else m.status = 'in-progress';

    console.log({ totalWorks, workDone, status: m.status });
    db.storeMessage(m);
    return newMsgs;
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
            {/* <option value=''></option> */}
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
          done={false}
          message={message}
          title='in-progress'
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onMark={handleMark}
        />
        <List
          members={workers}
          done
          message={message}
          title='done'
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
    flex-basis: clamp(310px, 50%, 400px);
    text-transform: uppercase;
    border: 2px gray red;
  }
`;

export default Message;
