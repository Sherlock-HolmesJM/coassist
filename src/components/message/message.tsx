import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { context } from '../../context/context';
import { setMessages, setMM } from '../../context/actions';
import List from './list';
import { MessageI, Worker } from '../../types';
import { db } from '../../services';
import * as mm from './messageModel';

function Message() {
  const { members, dispatch, messages } = useContext(context);
  const msgUID = useParams<{ slug: string }>().slug.replace(':', '');

  const [showform, setForm] = useState(false);

  const splitRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<HTMLSelectElement>(null);
  const splitLengthRef = useRef<HTMLInputElement>(null);

  const getSplit = () => splitRef.current?.value.trim().toLowerCase() ?? '';
  const getWUID = () => (workerRef.current ? +workerRef.current.value : 111);
  const setSplit = (split: string) => {
    if (splitRef.current) splitRef.current.value = split;
  };
  const getSplitLength = () =>
    splitLengthRef.current ? +splitLengthRef.current.value : 0;

  const freeMembers = members.filter((m) => m.active && m.free);
  const message = messages.find((m) => m.uid === +msgUID);
  const filename = message?.name + '-';
  const workers = message?.workers ?? [];

  useEffect(() => {
    setSplit(filename);
  }, [filename]);

  if (!message) return <Redirect to='/assignments' />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = freeMembers.find((w) => w.uid === getWUID());
    if (!member) return;

    const messagePart = getPart();
    if (mm.checkWork(message.workers, messagePart, member.type)) return;

    const newMessage: MessageI = { ...message, status: 'in-progress' };
    const newMember = { ...member, free: false };
    const { uid: muid, name, type } = newMember;

    const worker: Worker = {
      memuid: muid,
      name,
      type,
      uid: Date.now(),
      msguid: message.uid,
      msgname: message.name,
      part: messagePart,
      splitLength: getSplitLength(),
      done: false,
    };

    newMessage.workers.push(worker);
    mm.updateStatus(newMessage);
    const newMessages = mm.getNewMessages(newMessage, messages);
    const newMembers = mm.getNewMembers(newMember, members);
    dispatch(setMM(newMessages, newMembers));
    db.updateMember(newMember);
    db.updateMessage(newMessage);
    db.setWorker(worker);
  };

  const handleMark = (worker: Worker) => {
    const obj = members.find((m) => m.uid === worker.memuid);
    if (!obj) return;

    const wkr: Worker = { ...worker, done: !worker.done };

    const newMessage: MessageI = { ...message };
    const index = newMessage.workers.indexOf(worker);
    newMessage.workers[index] = wkr;
    mm.updateStatus(newMessage);

    const newMessages = mm.getNewMessages(newMessage, messages);
    const mem = {
      ...obj,
      free: mm.getMemberStatus(worker.memuid, newMessages),
    };
    const newMembers = mm.getNewMembers(mem, members);
    dispatch(setMM(newMessages, newMembers));

    db.updateMember(mem);
    db.updateMessage(newMessage);
    db.setWorker(wkr);
  };

  const handleDelete = (worker: Worker) => {
    const response = prompt('Are you sure?');
    if (response === null) return;

    const mem = members.find((m) => m.uid === worker.memuid);
    if (!mem) return;

    const newMessage = { ...message };
    newMessage.workers = message.workers.filter((w) => w.uid !== worker.uid);
    mm.updateStatus(newMessage);
    const megs = mm.getNewMessages(newMessage, messages);

    const member = { ...mem, free: mm.getMemberStatus(worker.memuid, megs) };
    const membs = mm.getNewMembers(member, members);

    db.updateMember(member);
    db.removeWorker(worker.msguid, worker.uid);
    db.updateMessage(newMessage);
    dispatch(setMM(megs, membs));
  };

  const handleUpdate = (worker: Worker) => {
    const messagePart = getPart();
    if (mm.checkWork(workers, messagePart, worker.type)) return;

    const newWorker: Worker = { ...worker, part: messagePart };

    const newMessage = { ...message };
    newMessage.workers = newMessage.workers.filter((w) => w.uid !== worker.uid);
    newMessage.workers.push(newWorker);

    const newMessages = mm.getNewMessages(newMessage, messages);
    dispatch(setMessages(newMessages));
    db.setWorker(newWorker);
  };

  // const update = (member: MemberI, worker: Worker) => {};

  const parseInput = (value: string) => {
    return value.slice(filename.length, value.length);
  };

  const getPart = () => {
    return parseInput(getSplit()) === '' ? message.name : getSplit();
  };

  return (
    <Section showform={showform}>
      <header className='header'>
        <nav className='nav'>
          <Link to='/assignments' className='btn btn-link'>
            Back
          </Link>
        </nav>
        <button className='btn btn-primary' onClick={() => setForm(true)}>
          Assign Split
        </button>
        <div className='form-container'>
          <form onSubmit={handleSubmit} className='form'>
            <div className='m-2 form-close-btn-div'>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => setForm(false)}
              >
                X
              </button>
            </div>
            <div className='m-2'>
              <input
                className='form-control'
                type='text'
                placeholder='filename'
                ref={splitRef}
                onChange={(e) =>
                  setSplit(filename + parseInput(e.target.value))
                }
                required
              />
            </div>
            <div className='m-2'>
              <div className='form-control header-splitlength-div'>
                <label className='header-label' htmlFor='splitlength'>
                  Split length (Mins):
                </label>
                <input
                  type='number'
                  ref={splitLengthRef}
                  className='header-splitlength'
                  required
                />
              </div>
            </div>
            <div className='m-2'>
              <div className='form-control'>
                <label
                  htmlFor='select-worker'
                  className='header-label form-label'
                >
                  Worker:
                </label>
                <select
                  required
                  id='select-worker'
                  className='form-select'
                  ref={workerRef}
                >
                  {freeMembers
                    .sort((a, b) => a.type.length - b.type.length)
                    .map((m, i) => (
                      <option key={i} value={m.uid}>
                        {`${m.name.toUpperCase()} - ${m.type}`}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className='m-2 form-btn-div'>
              <input className='btn btn-primary' type='submit' value='Add' />
            </div>
          </form>
        </div>
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

const Section = styled.section<{ showform: boolean }>`
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
  .form-container {
    position: relative;
    display: ${({ showform }) => (showform ? 'flex' : 'none')};
    justify-content: center;
    width: 100%;
  }
  .form {
    position: absolute;
    top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: min(94vw, 500px);
    background: gray;
    margin: 10px;
    z-index: 111;
  }
  .form-select {
    outline: none;
    border: none;
    border-bottom: 1px solid gray;
    color: gray;
  }
  .header-splitlength-div {
    display: flex;
  }
  .header-label {
    margin-right: 10px;
  }
  .header-splitlength {
    outline: none;
    border: none;
    border-bottom: 1px solid gray;
    width: 50px;
    color: gray;
    font-size: 18px;
  }
  .form-control {
    flex-basis: clamp(310px, 50%, 400px);
    text-transform: uppercase;
    border: 2px gray red;
  }
  .form-btn-div {
    display: flex;
    justify-content: center;
  }
  .form-close-btn-div {
    display: flex;
    justify-content: flex-end;
  }
`;

export default Message;
