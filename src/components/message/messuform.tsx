import { useContext, useEffect, useState } from 'react';
import { MessageI, Worker } from '../../types';
import * as mm from './messageModel';
import { context } from '../../context/context';
import { setMessages } from '../../context/actions';
import { db } from '../../services';
import { swalconfirm } from '../../utils';
import FormHolder from '../../commons/formHolder';
import { LabelTextField, ActionButtonHolder } from '../assignment/inputs';

interface UpdateProps {
  filename: string;
  worker: Worker;
  setWorker: (worker: Worker | null) => void;
  message: MessageI;
}

export const UpdateForm: React.FC<UpdateProps> = (props) => {
  const { message, filename, worker, setWorker } = props;
  const { dispatch, messages } = useContext(context);

  const [splitLength, setSplitLength] = useState(0);
  const [split, setSplit] = useState('');

  useEffect(() => {
    if (worker) {
      setSplit(worker.part.replace(filename, ''));
      setSplitLength(worker.splitLength ?? 0);
    }
    // eslint-disable-next-line
  }, [worker]);

  const getPart = (split) => filename + split;

  const handleUpdate = async (e: any, worker: Worker) => {
    e.preventDefault();

    const result = await swalconfirm(`Yes, update`);
    if (!result.isConfirmed) return;

    const part = getPart(split);

    if (!mm.checkWorker(message.workers, part, worker)) return;

    const newWorker: Worker = {
      ...worker,
      part,
      splitLength,
    };

    const newMessage = { ...message };
    const index = message.workers.indexOf(worker);
    newMessage.workers[index] = newWorker;

    const newMessages = mm.getNewMessages(newMessage, messages);
    dispatch(setMessages(newMessages));

    db.setWorker(newWorker);
    setWorker(null);
  };

  const handleChange = (value: string) => {
    const v = value.trim().toLowerCase();
    const worker = message.workers.find((w) => w.part === getPart(v));
    setSplitLength(worker?.splitLength || 0);
    setSplit(v);
  };

  const formHolderProps = {
    setShow: setWorker,
    show: worker,
    spin: false,
  };

  return (
    <FormHolder props={formHolderProps}>
      <form onSubmit={(e) => handleUpdate(e, worker)}>
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
        <ActionButtonHolder value='update' />
      </form>
    </FormHolder>
  );
};
