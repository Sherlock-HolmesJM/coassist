import React, { useContext, useEffect, useRef, useState } from 'react';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI } from '../../types';
import { db } from '../../services';
import * as mm from '../message/messageModel';
import { hmsToSeconds, secondsToHMS } from '../../utils';
import Loader from '../../commons/loader';
import { determineSent } from './assignemntUtils';

export interface FormProps {
  message: MessageI;
  setMessage: (m: MessageI | null) => void;
}

const FormUpdate: React.FC<FormProps> = (props) => {
  const { message, setMessage } = props;

  const { dispatch, messages } = useContext(context);

  const [spin, setSpin] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const hRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);

  const [sent2CGT, setSent2CGT] = useState('');

  useEffect(() => {
    if (!message) return;

    if (nameRef) nameRef.current.value = message.name;
    if (sizeRef) sizeRef.current.value = message.size + '';
    if (hRef && mRef && sRef) {
      const [h, m, s] = message.originalLength.split(':');
      hRef.current.value = h;
      mRef.current.value = m;
      sRef.current.value = s;
    }
    setSent2CGT(message.sent2CGT ?? '');
    // eslint-disable-next-line
  }, [message]);

  if (!message) return null;

  const handleAddFromFiles = () => {
    const audio = document.createElement('audio');
    const file = fileRef.current.files[0];

    if (!file) return alert(`File is ${file}. Try again.`);
    if (file.type !== 'audio/mpeg')
      return alert('Invalid file type. Try again with audio files.');

    const name = file.name.replace('.mp3', '');
    const size = Math.floor(file.size / 1024 / 1024);
    nameRef.current.value = name;
    sizeRef.current.value = size + '';

    const reader = new FileReader();

    reader.onload = (e) => {
      setSpin(true);
      audio.src = e.target.result as any;
      audio.onloadedmetadata = (e) => {
        // audio.duration is in seconds
        const { h, m, s } = secondsToHMS(audio.duration);
        hRef.current.value = h;
        mRef.current.value = m;
        sRef.current.value = s;
        setSpin(false);
      };
    };

    reader.onerror = (e) => {
      setSpin(false);
      alert(e);
    };

    if (size <= 200) reader.readAsDataURL(file);
    else {
      alert(
        `The File size of ${size}MB is too large to get the duration. You are going to have to get it yourself.`
      );
    }
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

    const name = nameRef.current?.value.trim().toLowerCase() ?? '';

    const found = messages.find((m) => m.name === name);
    if (found && found.uid !== message.uid)
      return alert(`${name.toUpperCase()} has already been added`);

    const size = sizeRef.current ? +sizeRef.current.value : 0;
    const duration = hmsToSeconds(
      hRef.current.value,
      mRef.current.value,
      sRef.current.value
    );
    const { h, m, s } = secondsToHMS(duration);

    const newMessage: MessageI = {
      ...message,
      name,
      duration,
      originalLength: `${h}:${m}:${s}`,
      size,
      sent2CGT: determineSent(message, sent2CGT as any),
    };

    mm.updateStatus(newMessage);

    if (name !== message.name) {
      console.log(name, message.name);
      newMessage.workers.forEach((w) => {
        w.part = w.part.replace(w.msgname, newMessage.name);
        w.msgname = newMessage.name;
      });
      db.updateWorkers(newMessage.workers);
    }

    const index = messages.indexOf(message);
    const list = [...messages];
    list[index] = newMessage;

    dispatch(setMessages(list));
    db.updateMessage(newMessage);
    setMessage(null);
    alert('Updated');
  };

  return (
    <form onSubmit={(e) => handleUpdate(e, message)} className='form'>
      <Loader spin={spin} />
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
          ref={nameRef}
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
  );
};

export default FormUpdate;
