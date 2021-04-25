import React, { useContext, useEffect, useRef, useState } from 'react';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI } from '../../types';
import { db } from '../../services';
import * as mm from '../message/messageModel';
import { secondsToHMS, swals } from '../../utils';
import Loader from '../../commons/loader';
import { getFileDetails, determineSent, updateWorkers } from './helper';

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
  const { h, m, s } = time;

  const fileRef = useRef<HTMLInputElement>(null);

  const [sent2CGT, setSent2CGT] = useState('');

  useEffect(() => {
    if (!message) return;

    const { name, size, duration, sent2CGT } = message;
    const time = secondsToHMS(duration);
    setData({ ...data, name, size, duration, time, sent: sent2CGT });
    // eslint-disable-next-line
  }, [message]);

  if (!message) return null;

  const handleAddFromFiles = () => {
    const file = fileRef.current.files[0];
    setData({ ...data, spin: true });
    getFileDetails(file, (name, size, duration) => {
      const time = secondsToHMS(duration);
      setData({ ...data, name, size, duration, time, spin: false });
    });
  };

  const handleChangeFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, dataset } = e.target;
    const t = dataset.type;
    const type = t === 'h' ? 'm' : t === 'm' ? 's' : 'size';

    if (value.length === 2)
      (document.querySelector(`.focus.${type}`) as any)?.focus();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type } = e.target.dataset;

    setData({ ...data, time: { ...data.time, [type]: e.target.value } });
  };

  const handleUpdate = (e: any, message: MessageI) => {
    e.preventDefault();

    const result = prompt('Are you sure?');
    if (result === null) return;

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
        <div className='m-2'>
          <input
            className='form-control'
            type='text'
            placeholder='filename'
            required
            value={name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
        <div className='m-2'>
          <div
            className='form-control duration-holder'
            onChange={handleChangeFocus}
          >
            <p onClick={undefined} style={{ marginRight: '10px' }}>
              Duration (H:M:S)
            </p>
            <input
              type='number'
              placeholder='00'
              data-type='h'
              required
              className='duration focus h'
              value={h}
              onFocus={(e) => e.target.select()}
              onChange={handleTimeChange}
            />
            :
            <input
              type='number'
              placeholder='00'
              data-type='m'
              required
              value={m}
              className='duration focus m'
              onFocus={(e) => e.target.select()}
              onChange={handleTimeChange}
            />
            :
            <input
              type='number'
              placeholder='00'
              data-type='s'
              required
              value={s}
              className='duration focus s'
              onFocus={(e) => e.target.select()}
              onChange={handleTimeChange}
            />
          </div>
        </div>
        <div className='m-2'>
          <input
            className='form-control size focus'
            type='number'
            placeholder='size (MB)'
            value={data.size}
            onChange={(e) => setData({ ...data, size: +e.target.value })}
            required
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
        <div className='m-2'>
          <input
            className='form-control'
            type='file'
            placeholder='Get File(s)'
            ref={fileRef}
            onChange={handleAddFromFiles}
          />
        </div>
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
          <input className='btn btn-success' type='submit' value='Update' />
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormUpdate;
