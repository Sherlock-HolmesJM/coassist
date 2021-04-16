import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import List from '../commons/list';
import { Link } from 'react-router-dom';
import { capitalize } from '../utils';
import { context } from '../context/context';
import { setMembers } from '../context/actions';
import { MemberI, MemberType } from '../types';
import { db } from '../services';
import { getMemberStatus } from './message/messageModel';

export interface MembersProps {}

const MembersComp: React.FC<MembersProps> = (props) => {
  const { dispatch, members, messages, collatorName, groupName } = useContext(
    context
  );

  // const [name, setName] = useState('');
  const [type, setType] = useState<MemberType>('T');

  const nameRef = useRef<HTMLInputElement>(null);

  const activeMembers = members.filter((m) => m.active);
  const inactiveMembers = members.filter((m) => !m.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.toLowerCase().trim() ?? '';
    const index = members.findIndex((m) => m.name === name);
    if (index !== -1) return alert(`${capitalize(name)} is already a member.`);

    const newMember: MemberI = {
      uid: Date.now(),
      name,
      type,
      active: false,
      free: false,
    };
    const newMembers: MemberI[] = [...members, newMember];

    nameRef.current?.focus();
    if (nameRef.current) nameRef.current.value = '';
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

  const handleDelete = (muid: number) => {
    const result = prompt('Are you sure?');
    if (result === null) return;
    const newMembers = members.filter((m) => m.uid !== muid);
    dispatch(setMembers(newMembers));
    db.deleteMember(muid);
  };

  return (
    <Section>
      <header className='header'>
        <nav className='nav'>
          <Link to='/home' className='btn btn-link'>
            Back
          </Link>
          <button className='btn btn-primary' onClick={() => window.print()}>
            Get PDF
          </button>
        </nav>
        <form onSubmit={handleSubmit} className='form'>
          <input
            className='form-control'
            type='text'
            placeholder="member's name"
            required
            ref={nameRef}
          />
          <select
            name='type'
            id='type'
            required
            className='form-select'
            onChange={(e) => setType(e.target.value as MemberType)}
          >
            <option value='T'>T</option>
            <option value='TE'>TE</option>
          </select>
          <input className='btn btn-primary' type='submit' value='Add' />
        </form>
      </header>
      <div className='container'>
        <List
          items={inactiveMembers}
          title='inactive members'
          onMark={handleMark}
          onDelete={handleDelete}
        />
        <List
          items={activeMembers}
          title='active members'
          onMark={handleMark}
          onDelete={handleDelete}
        />
      </div>
      <div className='hide'>
        <div className='hide-title-container'>
          <h4>{groupName} Members List</h4>
          <h4>Collator: {collatorName}</h4>
        </div>
        <div className='hide-container'>
          <List items={members} title='all members' />
          <List items={activeMembers} title='active members' />
          <List items={inactiveMembers} title='inactive members' />
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
