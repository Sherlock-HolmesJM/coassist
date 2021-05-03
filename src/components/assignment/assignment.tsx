import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { context } from '../../context/context';
import { setMessages, setMM } from '../../context/actions';
import { MessageI, MessageStatus } from '../../types';
import { db } from '../../services';
import { getMemberStatus } from '../message/messageModel';
import { ClickBadge } from '../../commons/badge';
import FormAdd from './assaform';
import FormUpdate from './assuform';
import Loader from '../../commons/loader';
import { swalconfirm } from '../../utils';

function Assignment() {
  const { dispatch, messages, members } = useContext(context);
  const [showform, setShowform] = useState(false);
  const [message, setMessage] = useState<MessageI | null>();

  const sorted = messages.sort((a, b) => a.rank - b.rank);

  const undone = messages.filter((m) => m.status === 'undone').length;
  const done = messages.filter((m) => m.status === 'done').length;
  const inProgress = messages.filter((m) => m.status === 'in-progress').length;
  const incomplete = messages.filter((m) => m.status === 'incomplete').length;
  const transcribed = messages.filter((m) => m.status === 'transcribed').length;
  const sent = messages.filter((m) => m.status === 'sent2CGT').length;

  const getColor = (status: MessageStatus) =>
    status === 'sent2CGT'
      ? 'info'
      : status === 'undone'
      ? 'success'
      : status === 'in-progress'
      ? 'warning'
      : status === 'incomplete'
      ? 'secondary'
      : status === 'transcribed'
      ? 'secondary'
      : 'danger';

  const handleDelete = async (message: MessageI) => {
    const result = await swalconfirm(
      `Yes, delete it`,
      `Delete ${message.name.toUpperCase()}!`
    );
    if (!result.isConfirmed) return;

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

  return (
    <Section>
      <Loader spin={false} />
      <header className='header'>
        <nav className='nav'>
          <Link to='/home' className='btn btn-link'>
            Back
          </Link>
          <Link to='/members' className='btn btn-link'>
            Members
          </Link>
          <button className='btn btn-primary' onClick={() => setShowform(true)}>
            New Message
          </button>
        </nav>
      </header>
      <div>
        <FormAdd setShowform={setShowform} showform={showform} />
        <FormUpdate message={message} setMessage={setMessage} />
      </div>
      <div className='bg-container animate__animated animate__fadeIn'>
        <div className='badge badge-secondary bg-summary'>
          <div className='badge-content'>
            <span>Undone:</span>
            <span>{undone}</span>
          </div>
          <div className='badge-content'>
            <span>Transcribed:</span>
            <span>{transcribed}</span>
          </div>
          <div className='badge-content'>
            <span>Incomplete:</span>
            <span>{incomplete}</span>
          </div>
          <div className='badge-content'>
            <span>In-progress:</span>
            <span>{inProgress}</span>
          </div>
          <div className='badge-content'>
            <span>Done:</span>
            <span>{done}</span>
          </div>
          <div className='badge-content'>
            <span>Sent:</span>
            <span>{sent}</span>
          </div>
        </div>
      </div>
      <main className='list-container animate__animated animate__backInUp'>
        <div className='list-group-k'>
          {sorted.map((m) => (
            <div key={m.name} className='list-group-item'>
              <div className='list-group-item-content'>
                <Link to={`/assignments:${m.uid}`} className='link fading-1'>
                  {m.name}
                </Link>
                <div>
                  <em className='list-group-item-status'>{m.status}</em>
                </div>
              </div>
              <div className='list-group-item-badges'>
                <ClickBadge
                  classes='bg-color'
                  color={getColor(m.status)}
                  onClick={() => setMessage(m)}
                  text='u'
                />
                <ClickBadge
                  classes='bg-color'
                  color={getColor(m.status)}
                  onClick={() => handleDelete(m)}
                  text='x'
                />
              </div>
            </div>
          ))}
        </div>
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
  .badge-content {
    display: flex;
    justify-content: space-between;
  }
  .badge-content > * {
    margin: 2px;
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
    text-transform: uppercase;
    padding: 6px;
  }
  .list-group-item-content {
    flex: 1;
  }
  .list-group-item-status {
    font-size: 11px;
    font-weight: 700;
    color: black;
  }
  .list-group-item-badges {
    display: flex;
    height: 30px;
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
