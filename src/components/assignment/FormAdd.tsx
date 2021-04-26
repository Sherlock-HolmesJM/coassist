import React, { useContext, useRef, useState } from 'react';
import { capitalize, secondsToHMS, swale, swali, swals } from '../../utils';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI, createTorTE } from '../../types';
import { db } from '../../services';
import Loader from '../../commons/loader';
import { SizeInput, NameInput, FileInput } from './inputs';
import TimeInput from './timeInput';

export interface FormProps {
  setShowform: (value: boolean) => void;
  showform: boolean;
}

const initialData = {
  name: '',
  size: 0,
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

  const { name, size, duration, spin, time } = data;
  const { h, m, s } = time;

  if (!showform) return null;

  const handleGetDetails = (name: string, size: number, duration: number) => {
    if (duration === 0) swali('Could not get duration of audio.');
    else swals('You may proceed.', 'Got details.');

    const time = secondsToHMS(duration);
    setData({ ...data, name, size, time });
  };

  const getFilename = () => name.toLowerCase().trim() ?? '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filename = getFilename();
    const index = messages.findIndex((m) => m.name === filename);

    if (index !== -1)
      return swale(
        `${filename.toUpperCase()} has already been added.`,
        'Duplicate message'
      );

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
      splitLength: 0,
      originalLength: `${h}:${m}:${s}`,
    };

    const list = [...messages, message];

    dispatch(setMessages(list));
    setData(initialData);
    db.setMessage(message);
    swals('', 'New message added.');
  };

  return (
    <React.Fragment>
      <Loader spin={spin} />
      <form onSubmit={handleSubmit} className='form'>
        <div className='btn-close-div'>
          <input
            className='btn btn-danger'
            type='button'
            value='X'
            onClick={() => setShowform(false)}
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
        <div className='m-2 btn-group'>
          <FileInput callback={handleGetDetails} />
          <input className='btn btn-primary' type='submit' value='Add' />
        </div>
      </form>
    </React.Fragment>
  );
};

export default FormAdd;
