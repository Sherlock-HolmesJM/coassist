import React, { useContext, useEffect, useState } from 'react';
import { MemberI, MessageI, Worker } from '../../types';
import * as mm from './messageModel';
import { context } from '../../context/context';
import { setMM } from '../../context/actions';
import { db } from '../../services';
import { ActionButtonHolder } from '../assignment/inputs';
import { Select, LabelTextField } from '../assignment/inputs';
import FormHolder from '../../commons/formHolder';
import { capitalize, swalconfirm } from '../../utils';

export interface AddProps {
  filename: string;
  showform: boolean;
  activemembers: MemberI[];
  message: MessageI;
  setForm: (value: boolean) => void;
}

export const AddForm: React.FC<AddProps> = (props: AddProps) => {
  const { setForm, filename, showform, activemembers, message } = props;

  const { dispatch, messages, members } = useContext(context);
  const [workerUID, setWorkerUID] = useState(0);

  const [splitLength, setSplitLength] = useState(0);
  const [split, setSplit] = useState('');

  const sorted = activemembers
    .sort((a, b) => `${a.free}`.length - `${b.free}`.length)
    .sort((a, b) => a.type.length - b.type.length)
    .map((m) => [
      m.uid + '',
      `${m.name} - ${m.type} ${m.free ? '[Free]' : ''}`,
    ]);

  useEffect(() => {
    sorted[0] && setWorkerUID(+sorted[0][0]);
    // eslint-disable-next-line
  }, [showform]);

  const getPart = (split: string) => filename + split;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const member = activemembers.find((w) => w.uid === workerUID);

    if (!member) return;

    const part = getPart(split);
    if (mm.checkWork(message.workers, part, member.type)) return;

    if (!member.free) {
      const res = await swalconfirm(
        'Yes, Continue',
        `${capitalize(member.name)} is not free at the moment.`
      );
      if (!res.isConfirmed) return;
    }

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
      dateReceived: new Date().toJSON(),
      dateReturned: '',
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
    const worker = message.workers.find((w) => w.part === getPart(value));
    setSplitLength(worker?.splitLength || 0);
    setSplit(value);
  };

  const formHolderProps = {
    setShow: setForm,
    show: showform,
    spin: false,
  };

  return (
    <FormHolder props={formHolderProps}>
      <form onSubmit={handleSubmit}>
        <LabelTextField
          value={split}
          label={filename}
          placeholder={'s1'}
          onChange={(value) => handleChange(value)}
        />
        <LabelTextField
          type='number'
          value={splitLength / 60 + ''}
          label='Split Length (Min)'
          onChange={(value) => setSplitLength(+value * 60)}
        />
        <Select
          label='Worker'
          value={workerUID + ''}
          values={sorted}
          onChange={(e) => setWorkerUID(+e.target.value)}
        />
        <ActionButtonHolder value='assign' />
      </form>
    </FormHolder>
  );
};
