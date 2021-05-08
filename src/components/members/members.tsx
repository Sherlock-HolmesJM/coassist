import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import List from '../../commons/list';
import { Link } from 'react-router-dom';
import { capitalize, swalconfirm, swale } from '../../utils';
import { context } from '../../context/context';
import { setMembers, setMM } from '../../context/actions';
import { MemberI } from '../../types';
import { db } from '../../services';
import { getMemberStatus } from '../message/messageModel';
import Addform from './memaform';
import UpdateForm from './memuform';
import Loader from '../../commons/loader';

export interface MembersProps {}

const MembersComp: React.FC<MembersProps> = () => {
  const {
    dispatch,
    members,
    messages,
    collatorName,
    groupName,
    spin,
  } = useContext(context);

  const [show, setShow] = useState<any>(false);
  const [member, setMember] = useState<MemberI | false>(false);

  const activeMembers = members.filter((m) => m.active && !m.givenOut);
  const inactiveMembers = members.filter((m) => !m.active);
  const givenOut = members
    .filter((m) => m.active && m.givenOut)
    .sort((a, b) => a.givenOut.localeCompare(b.givenOut));

  type Sig = {
    name: string;
    type: 'T' | 'TE';
    capacity: number;
    givenOut: string;
  };

  const handleSubmit = (props: Sig) => {
    const { name, capacity, type } = props;

    const index = members.findIndex((m) => m.name === name);
    if (index !== -1) return swale(`${capitalize(name)} is already a member.`);

    const newMember: MemberI = {
      uid: Date.now(),
      name,
      type,
      active: false,
      free: false,
      capacity,
      reason: '',
      givenOut: '',
    };
    const newMembers: MemberI[] = [...members, newMember];

    dispatch(setMembers(newMembers));
    db.setMember(newMember);
  };

  const handleMark = (member: MemberI) => {
    const newMember: MemberI = {
      ...member,
      free: getMemberStatus(member.uid, messages),
      active: !member.active,
    };

    const index = members.indexOf(member);
    const newMembers = [...members];
    newMembers[index] = newMember;
    dispatch(setMembers(newMembers));
    db.updateMember(newMember);
  };

  const handleDelete = async (member: MemberI) => {
    const result = await swalconfirm(
      `Yes, delete`,
      `Delete ${member.name.toUpperCase()}!`
    );
    if (!result.isConfirmed) return;

    const newMembers = members.filter((m) => m.uid !== member.uid);
    dispatch(setMembers(newMembers));
    db.deleteMember(member.uid);
  };

  const handleUpdate = async (props: Sig) => {
    if (!member) return;
    const { name, capacity, type, givenOut } = props;

    const obj = { ...member, type, givenOut, name, capacity };
    obj.free = obj.free ? givenOut === '' : false;

    const index = members.indexOf(member);
    const newMembers = [...members];
    newMembers[index] = obj;

    if (member.name !== name || member.capacity !== capacity) {
      messages.forEach((message) => {
        message.workers
          .filter((worker) => worker.memuid === member.uid)
          .forEach((worker) => {
            console.log(worker.name, 'before');
            worker.capacity = capacity;
            worker.name = name;
            console.log(worker.name, 'after');
            db.updateWorker(worker);
          });
      });

      dispatch(setMM([...messages], newMembers));
    } else {
      dispatch(setMembers(newMembers));
    }
    db.updateMember(obj);
  };

  return (
    <Section>
      <Loader spin={spin} />
      <header className='header'>
        <nav className='nav'>
          <Link to='/home' className='btn btn-link'>
            Back
          </Link>
          <Link to='/assignments' className='btn btn-link'>
            Assignment
          </Link>
          <button className='btn btn-primary' onClick={() => setShow(true)}>
            New Member
          </button>
          <button className='btn btn-primary' onClick={() => window.print()}>
            Get PDF
          </button>
        </nav>
      </header>
      <Addform setShow={setShow} show={show} onAdd={handleSubmit} />
      <UpdateForm
        setMember={setMember}
        member={member}
        onUpdate={handleUpdate}
      />
      <div className='container'>
        <List
          items={inactiveMembers}
          title='inactive members'
          onMark={handleMark}
          onDelete={handleDelete}
          onUpdate={(member) => setMember(member)}
        />
        <List
          items={activeMembers}
          title='active members'
          onMark={handleMark}
          onDelete={handleDelete}
          onUpdate={(member) => setMember(member)}
        />
        <List
          items={givenOut}
          title='Given Out'
          onUpdate={(member) => setMember(member)}
        />
      </div>
      <div className='hide'>
        <div className='hide-title-container'>
          <h2>{groupName} Members List</h2>
          <h2>Collator: {collatorName}</h2>
        </div>
        <div className='hide-container'>
          <List items={activeMembers} title='active members' />
          <List items={inactiveMembers} title='inactive members' />
          <List items={givenOut} title='Given Out' />
        </div>
      </div>
    </Section>
  );
};

const Section = styled.section`
  // min-width: 200px;

  .header {
    display: flex;
    padding: 10px;
    margin: 10px;
    background: gray;
    flex-wrap: wrap;
  }
  .nav {
    padding: 10px;
  }
  .btn-link {
    color: white;
  }
  .form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .form-control {
    flex-basis: clamp(300px, 50%, 400px);
    text-transform: capitalize;
    border: 2px gray red;
  }
  .container > * {
    flex-basis: 400px;
  }
  .hide {
    display: none;
  }
  .hide-title-container {
    text-align: center;
    text-transform: capitalize;
    margin-bottom: 25px;
  }
  .hide-container {
    display: flex;
    justify-content: space-around;
  }

  @media print {
    .container,
    .header {
      display: none;
    }
    .hide {
      display: block;
    }
  }
`;

export default MembersComp;
