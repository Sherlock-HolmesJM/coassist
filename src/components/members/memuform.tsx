import { useEffect, useState } from 'react';
import { MemberI } from '../../types';
import { ActionButtonHolder, NameInput, Select } from '../assignment/inputs';
import FormContainer from '../../commons/formHolder';
import TimeInput from '../assignment/timeInput';
import { hmsToSeconds, secondsToHMS, swalconfirm } from '../../utils';

export interface UpdateProps {
  onUpdate: (object: any) => void;
  setMember: (value: MemberI | false) => void;
  member: MemberI | false;
}

const initial = {
  name: '',
  capacity: {
    h: '00',
    m: '00',
    s: '00',
  },
  type: '' as 'T' | 'TE',
  givenOut: '',
};

const Update: React.FC<UpdateProps> = (props) => {
  const [data, setData] = useState(initial);
  const { member, setMember, onUpdate } = props;

  const { name, capacity, type, givenOut } = data;

  useEffect(() => {
    if (member) {
      const { name, type, givenOut } = member;
      const capacity = secondsToHMS(member.capacity ?? 0);
      setData({ ...data, name, capacity, type, givenOut: givenOut ?? '' });
    }

    // eslint-disable-next-line
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await swalconfirm(`Yes, update`);
    if (!result.isConfirmed) return;

    const { h, m, s } = data.capacity;
    const capacity = hmsToSeconds(h, m, s);
    onUpdate({ ...data, capacity, givenOut, name: data.name.trim() });
    setMember(false);
  };

  const containerProps = {
    setShow: setMember,
    show: member,
    spin: false,
  };

  return (
    <FormContainer props={containerProps}>
      <form onSubmit={handleSubmit} className='form'>
        <NameInput
          value={name}
          placeholder={`Member's name`}
          setName={(name) => setData({ ...data, name })}
        />
        <TimeInput
          placeholder='Capacity (H:M:S)'
          time={capacity}
          setTime={(type, value) =>
            setData({ ...data, capacity: { ...data.capacity, [type]: value } })
          }
        />
        <Select
          value={type}
          values={[
            ['T', 'Transcriber'],
            ['TE', 'Transcript Editor'],
          ]}
          label='Type'
          onChange={(value) => setData({ ...data, type: value as any })}
        />
        <NameInput
          value={givenOut}
          placeholder={`Given out to:`}
          required={false}
          setName={(givenOut) => setData({ ...data, givenOut })}
        />
        <ActionButtonHolder value='update' />
      </form>
    </FormContainer>
  );
};

export default Update;
