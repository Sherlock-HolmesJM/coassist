import React, { useContext, useRef, useState } from 'react';
import { Form, FormProps } from './form';
import { MemberI, MessageI, Worker } from '../../../types';
import * as mm from '../messageModel';
import { context } from '../../../context/context';
import { setMM } from '../../../context/actions';
import { db } from '../../../services';

export interface AddProps extends FormProps {
  showform: boolean;
  freeMembers: MemberI[];
  message: MessageI;
  setForm: (value: boolean) => void;
}

export const AddForm: React.FC<AddProps> = (props: AddProps) => {
  const { setForm, filename, showform, freeMembers, message } = props;

  const { dispatch, messages, members } = useContext(context);

  const workerRef = useRef<HTMLSelectElement>(null);

  const [splitLength, setSplitLength] = useState(0);
  const [split, setSplit] = useState('');

  if (!showform) return null;

  const getWUID = () => (workerRef.current ? +workerRef.current.value : 111);
  const getPart = () => filename + split;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = freeMembers.find((w) => w.uid === getWUID());
    if (!member) return;

    const part = getPart();
    if (mm.checkWork(message.workers, part, member.type)) return;

    const newMessage: MessageI = { ...message, status: 'in-progress' };
    const newMember: MemberI = { ...member, free: false };
    const { uid: muid, name, type } = newMember;

    const worker: Worker = {
      memuid: muid,
      name,
      type,
      uid: Date.now(),
      msguid: message.uid,
      msgname: message.name,
      part,
      splitLength,
      done: false,
    };

    newMessage.workers.push(worker);
    mm.updateStatus(newMessage);
    const newMessages = mm.getNewMessages(newMessage, messages);
    const newMembers = mm.getNewMembers(newMember, members);
    dispatch(setMM(newMessages, newMembers));

    db.updateMember(newMember);
    db.updateMessage(newMessage);
    db.setWorker(worker);
  };

  const handleAddAll30 = () => {
    message.workers.forEach((w) => (w.splitLength = 30));

    mm.updateStatus(message);
    const newMessages = mm.getNewMessages(message, messages);
    dispatch(setMM(newMessages, members));

    db.updateWorkers(message.workers);
    db.updateMessage(message);
    alert('Done');
  };

  return (
    <Form>
      <form onSubmit={handleSubmit}>
        <div className='m-2 form-close-btn-div'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => setForm(false)}
          >
            X
          </button>
        </div>
        <div className='m-2'>
          <div className='form-control header-splitlength-div'>
            <label className='header-label' htmlFor='splitlength'>
              {filename}
            </label>
            <input
              type='text'
              className='form-split'
              placeholder='S1'
              onChange={(e) => setSplit(e.target.value.trim().toLowerCase())}
              required
            />
          </div>
        </div>
        <div className='m-2'>
          <div className='form-control header-splitlength-div'>
            <label className='header-label' htmlFor='splitlength'>
              Split length (Mins):
            </label>
            <input
              type='number'
              onChange={(e) => setSplitLength(+e.target.value)}
              className='header-splitlength'
              required
            />
          </div>
        </div>
        <div className='m-2'>
          <div className='form-control'>
            <label htmlFor='select-worker' className='header-label form-label'>
              Worker:
            </label>
            <select
              required
              id='select-worker'
              className='form-select'
              ref={workerRef}
            >
              {freeMembers
                .sort((a, b) => a.type.length - b.type.length)
                .map((m, i) => (
                  <option key={i} value={m.uid}>
                    {`${m.name.toUpperCase()} - ${m.type}`}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className='m-2 form-btn-div'>
          <input className='btn btn-primary' type='submit' value='Add' />
          <input
            className='btn btn-light'
            type='button'
            value='Add All 30'
            onClick={handleAddAll30}
          />
        </div>
      </form>
    </Form>
  );
};
