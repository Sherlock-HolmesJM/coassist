import React, { useContext, useEffect, useState } from 'react';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI } from '../../types';
import { db } from '../../services';
import * as mm from '../message/messageModel';
import { secondsToHMS, swalconfirm, swale, swali, swals } from '../../utils';
import Loader from '../../commons/loader';
import { determineSent, updateWorkers } from './helper';
import { SizeInput, NameInput, FileInput } from './inputs';
import TimeInput from './timeInput';

export interface FormProps {
  message: MessageI;
  setMessage: (m: MessageI | null) => void;
}

const FormUpdate: React.FC<FormProps> = (props) => {
  const { message, setMessage } = props;

  const { dispatch, messages } = useContext(context);

  const [data, setData] = useState({
    name: '',
    size: 0,
    sent: '',
    duration: 0,
    spin: false,
    time: {
      h: '0',
      m: '0',
      s: '0',
    },
  });

  const { name, size, duration, spin, time, sent } = data;

  const [sent2CGT, setSent2CGT] = useState('');

  useEffect(() => {
    if (!message) return;

    const { name, size, duration, sent2CGT } = message;
    const time = secondsToHMS(duration);
    setData({ ...data, name, size, duration, time, sent: sent2CGT });
    // eslint-disable-next-line
  }, [message]);

  if (!message) return null;

  const handleGetDetails = (name: string, size: number, duration: number) => {
    if (duration === 0) swali('Could not get duration of audio.');
    else swals('You may proceed.', 'Got details.');

    const time = secondsToHMS(duration);
    setData({ ...data, name, size, time });
  };

  const handleUpdate = async (e: any, message: MessageI) => {
    e.preventDefault();

    const result = await swalconfirm('Yes, update it!');
    if (!result.isConfirmed) return;

    const found = messages.find((m) => m.name === name);
    if (found && found.uid !== message.uid)
      return alert(`${name.toUpperCase()} has already been added`);

    const { h, m, s } = secondsToHMS(duration);

    const newMessage: MessageI = {
      ...message,
      name,
      duration,
      originalLength: `${h}:${m}:${s}`,
      size,
      sent2CGT: determineSent(message, sent as any),
    };

    mm.updateStatus(newMessage);

    if (name !== message.name) updateWorkers(name, newMessage.workers);

    const index = messages.indexOf(message);
    const list = [...messages];
    list[index] = newMessage;

    dispatch(setMessages(list));
    db.updateMessage(newMessage);
    setMessage(null);
    swals('', 'Updated');
  };

  return (
    <React.Fragment>
      <Loader spin={spin} />
      <form onSubmit={(e) => handleUpdate(e, message)} className='form'>
        <div className='btn-close-div'>
          <input
            className='btn btn-danger'
            type='button'
            value='X'
            onClick={() => setMessage(null)}
          />
        </div>
        <NameInput
          value={name}
          setName={(name) => setData({ ...data, name })}
        />
        <TimeInput
          time={time}
          setTime={(type, value) =>
            setData({ ...data, time: { ...data.time, [type]: value } })
          }
        />
        <SizeInput
          value={size}
          onChange={(e) => setData({ ...data, size: +e.target.value })}
        />
        <div className='m-2'>
          <div className='form-control'>
            <label htmlFor='select-worker' className='header-label form-label'>
              Sent to CGT:
            </label>
            <select
              required
              value={sent2CGT}
              onChange={(e) => setSent2CGT(e.target.value)}
              id='select-worker'
              className='form-select'
            >
              <option value='no'>no</option>
              <option value='yes'>yes</option>
            </select>
          </div>
        </div>
        <div className='m-2 btn-group'>
          <FileInput callback={handleGetDetails} />
          <input className='btn btn-success' type='submit' value='Update' />
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormUpdate;
