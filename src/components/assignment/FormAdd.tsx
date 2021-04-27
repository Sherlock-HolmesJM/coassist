import React, { useContext, useState } from 'react';
import { secondsToHMS, swale, swals } from '../../utils';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI, createTorTE } from '../../types';
import { db } from '../../services';
import { SizeInput, NameInput, FileInput } from './inputs';
import TimeInput from './timeInput';
import FormContainer from '../../commons/formHolder';

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

  const handleGetDetails = (name: string, size: number, duration: number) => {
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

  const containerProps = {
    setShow: setShowform,
    show: showform,
    spin,
  };

  return (
    <FormContainer props={containerProps}>
      <form onSubmit={handleSubmit} className='form'>
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
    </FormContainer>
  );
};

export default FormAdd;
