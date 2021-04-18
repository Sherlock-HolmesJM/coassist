import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { context } from '../../context/context';
import { setMessages, setMM } from '../../context/actions';
import { MessageI, MessageStatus } from '../../types';
import { db } from '../../services';
import { getMemberStatus } from '../message/messageModel';
import { ClickBadge } from '../../commons/badge';
import FormAdd from './FormAdd';
import FormUpdate from './formUpdate';

function Assignment() {
  const { dispatch, messages, members } = useContext(context);
  const [showform, setShowform] = useState(false);
  const [message, setMessage] = useState<MessageI | null>();

  const sorted = messages.sort((a, b) => b.status.localeCompare(a.status));

  const undone = messages.filter((m) => m.status === 'undone').length;
  const done = messages.filter((m) => m.status === 'done').length;
  const inProgress = messages.filter((m) => m.status === 'in-progress').length;

  const getColor = (status: MessageStatus) =>
    status === 'done'
      ? 'danger'
      : status === 'in-progress'
      ? 'warning'
      : 'success';

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

  return (
    <Section>
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
          <FormAdd setShowform={setShowform} showform={showform} />
          <FormUpdate message={message} setMessage={setMessage} />
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
                  onClick={() => setMessage(m)}
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

const Section = styled.section`
  .header {
    display: flex;
    padding: 10px;
    margin: 10px;
    background: gray;
    flex-wrap: wrap;
  }
  .header-form-holder {
    position: relative;
    display: flex;
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
  .btn-close-div {
    display: flex;
    justify-content: flex-end;
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
