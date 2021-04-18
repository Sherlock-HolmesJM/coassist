import React, { useContext, useEffect, useRef } from 'react';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI } from '../../types';
import { db } from '../../services';
import * as mm from '../message/messageModel';

export interface FormProps {
  message: MessageI;
  setMessage: (m: MessageI | null) => void;
}

const FormUpdate: React.FC<FormProps> = (props) => {
  const { message, setMessage } = props;

  const { dispatch, messages } = useContext(context);

  const fileRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const hRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!message) return;

    if (fileRef) fileRef.current.value = message.name;
    if (sizeRef) sizeRef.current.value = message.size + '';
    if (hRef && mRef && sRef) {
      const [h, m, s] = message.originalLength.split(':');
      hRef.current.value = h;
      mRef.current.value = m;
      sRef.current.value = s;
    }
    // eslint-disable-next-line
  }, [message]);

  if (!message) return null;

  const getDuration = () => {
    const h = hRef.current ? +hRef.current.value : 0;
    const m = mRef.current ? +mRef.current.value : 0;
    return h * 60 + m;
  };

  const getHMS = () => {
    const h = hRef.current ? +hRef.current.value : 0;
    const m = mRef.current ? +mRef.current.value : 0;
    const s = sRef.current ? +sRef.current.value : 0;

    return { h, m, s };
  };

  const handleChangeFocus = (e: any) => {
    const { value, dataset } = e.currentTarget;

    if (value.length === 2) {
      if (+dataset.index === 1) mRef.current?.focus();
      else if (+dataset.index === 2) sRef.current?.focus();
      else if (+dataset.index === 3) sizeRef.current?.focus();
    }
  };

  const handleUpdate = (e: any, message: MessageI) => {
    e.preventDefault();

    const result = prompt('Are you sure?');
    if (result === null) return;

    const size = sizeRef.current ? +sizeRef.current.value : 0;
    const duration = getDuration();
    const { h, m, s } = getHMS();

    const newMessage: MessageI = {
      ...message,
      duration,
      originalLength: `${h}:${m}:${s}`,
      size,
    };

    mm.updateStatus(newMessage);

    const index = messages.indexOf(message);
    const list = [...messages];
    list[index] = newMessage;

    dispatch(setMessages(list));
    // db.updateMessage(newMessage);
    // alert('Updated');
  };

  return (
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
            onFocus={(e) => e.currentTarget.select()}
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
            onFocus={(e) => e.currentTarget.select()}
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
            onFocus={(e) => e.currentTarget.select()}
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
      <div className='m-2 btn-group'>
        <input className='btn btn-success' type='submit' value='Update' />
      </div>
    </form>
  );
};

export default FormUpdate;
