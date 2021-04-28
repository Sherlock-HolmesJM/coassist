import React, { useContext, useRef, useState } from 'react';
import { Form, FormProps } from './form';
import { MemberI, MessageI, Worker } from '../../../types';
import * as mm from '../messageModel';
import { context } from '../../../context/context';
import { setMM } from '../../../context/actions';
import { db } from '../../../services';
import { clipText } from '../../../utils';
import { Select } from '../../assignment/inputs';

export interface AddProps extends FormProps {
  showform: boolean;
  activemembers: MemberI[];
  message: MessageI;
  setForm: (value: boolean) => void;
}

export const AddForm: React.FC<AddProps> = (props: AddProps) => {
  const { setForm, filename, showform, activemembers, message } = props;

  const { dispatch, messages, members } = useContext(context);

  const workerRef = useRef<HTMLSelectElement>(null);

  const [splitLength, setSplitLength] = useState(0);
  const [split, setSplit] = useState('');
  const [workerName, setworkerName] = useState('');

  if (!showform) return null;

  const getWUID = () => (workerRef.current ? +workerRef.current.value : 111);
  const getPart = (split: string) => filename + split;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = activemembers.find((w) => w.uid === getWUID());
    if (!member) return;

    const part = getPart(split);
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

  // const handleAddAll30 = () => {
  //   message.workers.forEach((w) => (w.splitLength = 30));

  //   mm.updateStatus(message);
  //   const newMessages = mm.getNewMessages(message, messages);
  //   dispatch(setMM(newMessages, members));

  //   db.updateWorkers(message.workers);
  //   db.updateMessage(message);
  //   alert('Done');
  // };

  const handleChange = (value: string) => {
    const v = value.trim().toLowerCase();
    const worker = message.workers.find((w) => w.part === getPart(v));
    setSplitLength(worker?.splitLength || 0);
    setSplit(v);
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
            <label
              className='header-label header-splitText'
              htmlFor='splitlength'
            >
              {clipText(filename)}
            </label>
            <label
              className='header-label header-fullText'
              htmlFor='splitlength'
            >
              {filename}
            </label>
            <input
              type='text'
              className='form-split'
              placeholder='S1'
              onChange={(e) => handleChange(e.target.value)}
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
              value={splitLength || ''}
              onChange={(e) => setSplitLength(+e.target.value)}
              className='header-splitlength'
              required
            />
          </div>
        </div>
        {/* <Select label="Worker"  /> */}
        <Select
          label='Worker'
          value={workerName}
          values={activemembers
            .sort((a, b) => a.type.length - b.type.length)
            .sort((a, b) => `${a.free}`.length - `${b.free}`.length)
            .map((m) => [
              m.name,
              `${m.name} - ${m.type} ${m.free ? '- Free: ' : ''}`,
            ])}
          onChange={(e) => setworkerName(e.target.value)}
        />
        <div className='m-2 form-btn-div'>
          <input className='btn btn-primary' type='submit' value='Add' />
        </div>
      </form>
    </Form>
  );
};
