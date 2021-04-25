import React, { useContext, useRef, useState } from 'react';
import { capitalize, secondsToHMS, hmsToSeconds } from '../../utils';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI, createTorTE } from '../../types';
import { db } from '../../services';
import Loader from '../../commons/loader';
import { getFileDetails } from './helper';

export interface FormProps {
  setShowform: (value: boolean) => void;
  showform: boolean;
}

const initialData = {
  name: '',
  size: 0,
  splitLength: 0,
  duration: 0,
  spin: false,
  time: {
    h: '0',
    m: '0',
    s: '0',
  },
};

const FormAdd: React.FC<FormProps> = (props) => {
  const { setShowform, showform } = props;

  const { dispatch, messages } = useContext(context);

  const [data, setData] = useState(initialData);

  const { name, size, duration, spin, time, splitLength } = data;
  const { h, m, s } = time;

  const nameRef = useRef<HTMLInputElement>(null);
  const hRef = useRef<HTMLInputElement>(null);

  if (!showform) return null;

  const handleAddFromFiles = (e: any) => {
    const file = e.target.files[0];
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

  const getFilename = () => name.toLowerCase().trim() ?? '';

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
      duration,
      transcriber: createTorTE('T'),
      transcriptEditor: createTorTE('TE'),
      size,
      splits: 1,
      transcribed: 'no',
      edited: 'no',
      sent2CGT: '',
      splitLength,
      originalLength: `${h}:${m}:${s}`,
    };

    const list = [...messages, message];

    dispatch(setMessages(list));
    setData(initialData);
    db.setMessage(message);
    nameRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <Loader spin={spin} />
      <div className='btn-close-div'>
        <input
          className='btn btn-danger'
          type='button'
          value='X'
          onClick={() => setShowform(false)}
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
            required
            className='duration'
            onChange={handleChangeFocus}
            onFocus={(e) => e.currentTarget.select()}
          />
          :
          <input
            type='number'
            placeholder='00'
            data-index='3'
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
          required
          onFocus={(e) => e.currentTarget.select()}
        />
      </div>
      <div className='m-2'>
        <input
          className='form-control'
          type='file'
          placeholder='Get File(s)'
          onChange={handleAddFromFiles}
        />
      </div>
      <div className='m-2 btn-group'>
        <input className='btn btn-primary' type='submit' value='Add' />
      </div>
    </form>
  );
};

export default FormAdd;
