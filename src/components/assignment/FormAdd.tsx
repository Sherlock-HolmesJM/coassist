import React, { useContext, useRef, useState } from 'react';
import { capitalize, secondsToHMS } from '../../utils';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { MessageI, createTorTE } from '../../types';
import { db } from '../../services';
import Loader from '../../commons/loader';

export interface FormProps {
  setShowform: (value: boolean) => void;
  showform: boolean;
}

const FormAdd: React.FC<FormProps> = (props) => {
  const { setShowform, showform } = props;

  const { dispatch, messages } = useContext(context);

  const [spin, setSpin] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const hRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const sRef = useRef<HTMLInputElement>(null);
  const splitRef = useRef<HTMLSelectElement>(null);

  if (!showform) return null;

  const getDuration = () => {
    const h = hRef.current ? +hRef.current.value : 0;
    const m = mRef.current ? +mRef.current.value : 0;
    return h * 60 + m;
  };

  const getSplitLength = () => {
    return splitRef.current ? +splitRef.current.value : 30;
  };

  const handleChangeFocus = (e: any) => {
    const { value, dataset } = e.currentTarget;

    if (value.length === 2) {
      if (+dataset.index === 1) mRef.current?.focus();
      else if (+dataset.index === 2) sRef.current?.focus();
      else if (+dataset.index === 3) sizeRef.current?.focus();
    }
  };

  const handleAddFromFiles = () => {
    const audio = document.createElement('audio');
    const file = fileRef.current.files[0];

    if (!file) return alert(`File is ${file}. Try again.`);
    if (file.type !== 'audio/mpeg')
      return alert('Invalid file type. Try again with audio files.');

    const name = file.name.replace('.mp3', '');
    const size = Math.floor(file.size / 1024 / 1024);

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
        nameRef.current.value = name;
        sizeRef.current.value = size + '';
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

  const getFilename = () => nameRef.current?.value.toLowerCase().trim() ?? '';

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
      duration: getDuration(),
      transcriber: createTorTE('T'),
      transcriptEditor: createTorTE('TE'),
      size: sizeRef.current ? +sizeRef.current.value : 1,
      splits: 1,
      transcribed: 'no',
      edited: 'no',
      splitLength: getSplitLength(),
      originalLength: `${hRef.current?.value}:${mRef.current?.value}:${sRef.current?.value}`,
    };

    const list = [...messages, message];

    dispatch(setMessages(list));
    nameRef.current?.focus();
    if (nameRef.current) nameRef.current.value = '';
    db.setMessage(message);
  };

  // eslint-disable-next-line
  const handleAddMissing = () => {
    messages.forEach((m) => {
      m.duration = m.duration || 0;
      m.originalLength = m.originalLength || '00:00:00';
      m.transcriber = m.transcriber || createTorTE('T');
      m.transcriptEditor = m.transcriptEditor || createTorTE('TE');
      m.transcribed = m.transcribed || 'no';
      m.edited = m.edited || 'no';
      m.category = 'sermon';
      m.size = m.size || 0;
      m.splits = m.splits || 1;
      m.splitLength = m.splitLength || 0;
    });

    dispatch(setMessages(messages));
    db.updateMessages(messages);
    alert('Missing fields added.');
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
      <div className='m-2 btn-group'>
        <input className='btn btn-primary' type='submit' value='Add' />
        {/* <input
          className='btn btn-light'
          type='button'
          value='Add Missing Fields'
          onClick={handleAddMissing}
        /> */}
      </div>
    </form>
  );
};

export default FormAdd;
