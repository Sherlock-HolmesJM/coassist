import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { capitalize } from '../../utils';
import { context } from '../../context/context';
import { setMessages, setMM } from '../../context/actions';
import { createTorTE, MessageI, MessageStatus, T_And_TE } from '../../types';
import { db } from '../../services';
import { getMemberStatus } from '../message/messageModel';
import { ClickBadge } from '../../commons/badge';

function Assignment() {
  const { dispatch, messages, members } = useContext(context);
  const fileRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const hRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);
  const splitRef = useRef<HTMLSelectElement>(null);
  const [showform, setShowform] = useState(false);

  const sorted = messages.sort((a, b) => b.status.localeCompare(a.status));

  const undone = messages.filter((m) => m.status === 'undone').length;
  const done = messages.filter((m) => m.status === 'done').length;
  const inProgress = messages.filter((m) => m.status === 'in-progress').length;

  const getFilename = () => fileRef.current?.value.toLowerCase().trim() ?? '';

  const getColor = (status: MessageStatus) =>
    status === 'done'
      ? 'danger'
      : status === 'in-progress'
      ? 'warning'
      : 'success';

  const getSplitLength = () => {
    return splitRef.current ? +splitRef.current.value : 30;
  };

  const getDuration = () => {
    const h = hRef.current ? +hRef.current.value : 0;
    const m = mRef.current ? +mRef.current.value : 0;
    return h * 60 + m;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filename = getFilename();
    const index = messages.findIndex((m) => m.name === filename);

    if (index !== -1)
      return alert(`${capitalize(filename)} is already being worked on.`);

    const message: MessageI = {
      uid: Date.now(),
      name: filename,
      status: 'undone',
      workers: [],
      category: 'sermon',
      duration: getDuration(),
      transcriber: createTorTE('T'),
      transcriptEditor: createTorTE('TE'),
      size: sizeRef.current ? +sizeRef.current.value : 1,
      splits: 1,
      transcribed: 'no',
      edited: 'no',
      splitLength: getSplitLength(),
      originalLength: `${hRef.current?.value}:${mRef.current?.value}:${sRef.current?.value}`,
    };

    const list = [...messages, message];

    dispatch(setMessages(list));
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
        mem.free = getMemberStatus(mem.uid, newMessages);
      });

      dispatch(setMM(newMessages, newMembers));
      db.updateMembers(newMembers);
    }

    db.removeMessage(message.uid);
  };

  const handleUpdate = (message: MessageI) => {
    const result = prompt('Are you sure?');
    if (result === null) return;

    const size = sizeRef.current ? +sizeRef.current.value : -1;
    const duration = getDuration();

    const newMessage: MessageI = {
      ...message,
      duration: duration === 0 ? message.duration : duration,
      size: size === -1 ? message.size : size,
    };

    const list = messages.filter((m) => m.uid !== message.uid);
    list.push(newMessage);
    dispatch(setMessages(list));
    db.updateMessage(newMessage);
    alert('Updated');
  };

  const handleChangeFocus = (e: any) => {
    const { value, dataset } = e.currentTarget;

    if (value.length === 2) {
      if (+dataset.index === 1) mRef.current?.focus();
      else if (+dataset.index === 2) sRef.current?.focus();
      else if (+dataset.index === 3) sizeRef.current?.focus();
    }
  };

  return (
    <Section showform={showform}>
      <header className='header'>
        <nav className='nav'>
          <Link to='/home' className='btn btn-link'>
            Back
          </Link>
          <button className='btn btn-primary' onClick={() => setShowform(true)}>
            New Message
          </button>
        </nav>
        <div className='header-form-holder'>
          <form onSubmit={handleSubmit} className='form'>
            <div className='m-2'>
              <input
                className='form-control'
                type='text'
                placeholder='filename'
                required
                ref={fileRef}
              />
            </div>
            <div className='m-2'>
              <div className='form-control duration-holder'>
                <p
                  onClick={() => hRef.current?.focus()}
                  style={{ marginRight: '10px' }}
                >
                  Duration (H:M:S)
                </p>
                <input
                  type='number'
                  min='0'
                  max='12'
                  placeholder='00'
                  data-index='1'
                  ref={hRef}
                  required
                  className='duration'
                  onChange={handleChangeFocus}
                />
                :
                <input
                  type='number'
                  min='0'
                  max='60'
                  placeholder='00'
                  data-index='2'
                  ref={mRef}
                  required
                  className='duration'
                  onChange={handleChangeFocus}
                />
                :
                <input
                  type='number'
                  min='0'
                  max='60'
                  placeholder='00'
                  data-index='3'
                  ref={sRef}
                  required
                  className='duration'
                  onChange={handleChangeFocus}
                />
              </div>
            </div>
            <div className='m-2'>
              <input
                className='form-control size'
                type='number'
                placeholder='size (MB)'
                ref={sizeRef}
                required
                min='0'
              />
            </div>
            <div className='m-2'>
              <div className='form-control header-splitlength-div'>
                <label
                  className='header-splitlength-label'
                  htmlFor='splitlength'
                >
                  Split length:
                </label>
                <select className='select' id='splitlength' ref={splitRef}>
                  <option value='30'>30 Mins</option>
                  <option value='60'>60 Mins</option>
                </select>
              </div>
            </div>
            <div className='m-2 btn-group'>
              <input className='btn btn-primary' type='submit' value='Add' />
              <input className='btn btn-primary' type='button' value='Update' />
              <input
                className='btn btn-primary'
                type='button'
                value='Close'
                onClick={() => setShowform(false)}
              />
            </div>
          </form>
        </div>
      </header>
      <div className='bg-container'>
        <div className='badge badge-secondary bg-summary'>
          UN:IP:D - {undone}:{inProgress}:{done}
        </div>
      </div>
      <main className='list-container'>
        <div className='list-group-k'>
          {sorted.map((m) => (
            <div key={m.name} className='list-group-item'>
              <Link to={`/assignments:${m.uid}`} className='link'>
                {m.name} - <em>{m.status}</em>
              </Link>
              <div>
                <ClickBadge
                  classes='bg-color'
                  color={getColor(m.status)}
                  onClick={() => handleDelete(m)}
                  text='x'
                />
                <ClickBadge
                  classes='bg-color'
                  color={getColor(m.status)}
                  onClick={() => handleUpdate(m)}
                  text='u'
                />
              </div>
            </div>
          ))}
        </div>
      </main>
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
  .header-form-holder {
    position: relative;
    display: ${({ showform }) => (showform ? 'flex' : 'none')};
    justify-content: center;
    width: 100%;
  }
  .header-splitlength-div {
    display: flex;
  }
  .header-splitlength-label {
    display: block;
    margin-right: 10px;
  }
  .bg-container {
    display: flex;
    justify-content: flex-end;
    margin: 5px 10px;
  }
  .bg-summary {
    padding: 5px;
    font-size: 15px;
  }
  .btn-link {
    color: white;
  }
  .form {
    position: absolute;
    top: 20px;
    display: flex;
    flex-direction: column;
    width: min(94vw, 500px);
    background-color: gray;
    padding: 5px;
    z-index: 111;
  }
  .form-control {
    flex-basis: clamp(310px, 50%, 400px);
    text-transform: capitalize;
    border: 2px gray red;
  }
  .duration-holder {
    display: flex;
  }
  .duration {
    width: 30px;
    outline: none;
    border: none;
    padding: 6px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .bg-color {
    float: right;
  }
  .list-container {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 10px;
  }
  .list-group-k {
    flex-basis: 600px;
  }
  .list-group-item {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    /* flex-basis: 550px; */
  }
  .link {
    color: gray;
    text-decoration: none;
  }
  .link:visited {
    color: gray;
  }
  .select {
    outline: none;
    border-radius: 5px;
    color: gray;
    border: none;
    margin: 0;
  }
`;

export default Assignment;
