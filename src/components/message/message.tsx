import { useContext, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { context } from '../../context/context';
import { setMM } from '../../context/actions';
import List from './list';
import { MessageI, Worker } from '../../types';
import { db } from '../../services';
import * as mm from './messageModel';
import { UpdateForm, AddForm } from './forms';

function Message() {
  const { members, dispatch, messages } = useContext(context);
  const msgUID = useParams<{ slug: string }>().slug.replace(':', '');

  const [showform, setForm] = useState(false);
  const [worker, setWorker] = useState<Worker | null>();

  const freeMembers = members.filter((m) => m.active && m.free);
  const message = messages.find((m) => m.uid === +msgUID);
  const filename = message?.name + '-';
  const workers = message?.workers ?? [];
  const ts = workers.filter((w) => w.type === 'T');
  const tes = workers.filter((w) => w.type === 'TE');

  if (!message) return <Redirect to='/assignments' />;

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
      </header>
      <div className='forms'>
        <UpdateForm
          filename={filename}
          worker={worker}
          setWorker={setWorker}
          message={message}
        />
        <AddForm
          filename={filename}
          message={message}
          freeMembers={freeMembers}
          setForm={setForm}
          showform={showform}
        />
      </div>
      <div className='badge badge-secondary badge-assigned'>
        <div>Assigned Length [Ts]: {mm.getAssignedLength(ts)}</div>
        <div>Assigned Length [TEs]: {mm.getAssignedLength(tes)}</div>
        <div>Original Length: {message.originalLength}</div>
      </div>
      <div className='container'>
        <List
          workers={workers.filter((w) => !w.done)}
          done={false}
          title='in-progress'
          onDelete={handleDelete}
          onUpdate={setWorker}
          onMark={handleMark}
        />
        <List
          workers={workers.filter((w) => w.done)}
          done
          title='done'
          onDelete={handleDelete}
          onUpdate={setWorker}
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
  .forms {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .badge-assigned {
    text-align: left;
    margin-left: 10px;
    padding: 5px;
  }
  .badge-assigned > * {
    margin: 2px;
    padding: 2px;
  }
  .container > * {
    flex-basis: 400px;
  }
`;

export default Message;
