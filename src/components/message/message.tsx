import React, { useContext, useEffect, useRef } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { context } from '../../context/context';
import { setMessages, setMM } from '../../context/actions';
import List from './list';
import { MemberI, MessageI, Worker } from '../../types/member';
import { db } from '../../services';
import * as mm from './messageModel';

interface Props {}

function Message(props: Props) {
  const { members, dispatch, messages } = useContext(context);
  const messageName = useParams<{ slug: string }>().slug.replace(':', '');
  // const [split, setSplit] = useState('');

  const splitRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<HTMLSelectElement>(null);

  const getSplit = () => splitRef.current?.value.trim().toLowerCase() ?? '';
  const getWorkerName = () =>
    workerRef.current?.value.trim().toLowerCase() ?? '';
  const setSplit = (split: string) => {
    if (splitRef.current) splitRef.current.value = split;
  };

  const filename = messageName + '-';
  const freeMembers = members.filter((m) => m.active && m.free);
  const message = messages.find((m) => m.name === messageName);
  const workers = message?.workers ?? ([] as Worker[]);

  useEffect(() => {
    setSplit(filename);
  }, [filename]);

  // console.log(nameWorker);

  if (!message) return <Redirect to='/assignments' />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = freeMembers.find((w) => w.name === getWorkerName());
    if (!member) return;

    const messagePart = getPart();
    if (mm.checkWork(message.workers, messagePart, member.type)) return;

    const newMessage: MessageI = { ...message, status: 'in-progress' };
    const newMember = { ...member, free: false };
    const { name, type } = newMember;

    const worker: Worker = {
      wid: Date.now(),
      message: messageName,
      part: messagePart,
      done: false,
      name,
      type,
    };

    newMessage.workers.push(worker);
    const newMessages = mm.getNewMessages(newMessage, messages);
    const newMembers = mm.getNewMembers(newMember, members);
    dispatch(setMM(newMessages, newMembers));
    db.updateMember(newMember);
    db.updateMessage({ name: newMessage.name, status: newMessage.status });
    db.setWorker(worker);
  };

  const handleMark = (worker: Worker) => {
    const mem = members.find((m) => m.name === worker.name);
    if (!mem) return;

    const wkr: Worker = { ...worker, done: !worker.done };

    update(mem, wkr);
    db.setWorker(wkr);
  };

  const handleDelete = (worker: Worker) => {
    const mem = members.find((m) => m.name === worker.name);
    if (!mem) return;

    const newMessage = { ...message };
    newMessage.workers = message.workers.filter((w) => w.wid !== worker.wid);
    newMessage.status = mm.getMessageStatus(newMessage);
    const megs = mm.getNewMessages(newMessage, messages);

    const member = { ...mem, free: mm.getMemberStatus(worker.name, megs) };
    const membs = mm.getNewMembers(member, members);

    db.updateMember(member);
    db.removeWorker(worker.message, worker.wid);
    db.updateMessage({
      name: newMessage.name,
      status: newMessage.status,
    });
    dispatch(setMM(megs, membs));
  };

  const handleUpdate = (worker: Worker) => {
    const messagePart = getPart();
    if (mm.checkWork(workers, messagePart, worker.type)) return;

    const newWorker: Worker = { ...worker, part: messagePart };

    const newMessage = { ...message };
    newMessage.workers = newMessage.workers.filter((w) => w.wid !== worker.wid);
    newMessage.workers.push(newWorker);

    const newMessages = mm.getNewMessages(newMessage, messages);
    dispatch(setMessages(newMessages));
    db.setWorker(newWorker);
  };

  const update = (member: MemberI, worker: Worker) => {
    const newMessage: MessageI = { ...message };
    newMessage.workers = newMessage.workers.filter((w) => w.wid !== worker.wid);
    newMessage.workers.push(worker);
    newMessage.status = mm.getMessageStatus(newMessage);

    const newMessages = mm.getNewMessages(newMessage, messages);
    const mem = {
      ...member,
      free: mm.getMemberStatus(worker.name, newMessages),
    };
    const newMembers = mm.getNewMembers(mem, members);
    dispatch(setMM(newMessages, newMembers));
    db.updateMember(mem);
    db.updateMessage({
      name: newMessage.name,
      status: newMessage.status,
    });
  };

  const parseInput = (value: string) =>
    value.slice(filename.length, value.length);
  const getPart = () =>
    parseInput(getSplit()) === '' ? messageName : getSplit();

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
            ref={splitRef}
            onChange={(e) => setSplit(filename + parseInput(e.target.value))}
            required
          />
          <select required className='form-select' ref={workerRef}>
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
          workers={workers.filter((w) => !w.done)}
          done={false}
          title='in-progress'
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onMark={handleMark}
        />
        <List
          workers={workers.filter((w) => w.done)}
          done
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
