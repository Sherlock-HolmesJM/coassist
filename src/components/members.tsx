import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import List from '../commons/list';
import { Link } from 'react-router-dom';
import { capitalize } from '../util';
import { context } from '../context/context';
import { setMembers } from '../context/actions';
import { MemberI, MemberType } from '../types/member';
import { db } from '../services';

export interface MembersProps {}

const MembersComp: React.FC<MembersProps> = (props) => {
  const { dispatch, members } = useContext(context);

  const [name, setName] = useState('');
  const [type, setType] = useState<MemberType>('T');

  const nameRef = useRef<HTMLInputElement>(null);

  const activeMembers = members.filter((m) => m.active);
  const inactiveMembers = members.filter((m) => !m.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const index = members.findIndex((m) => m.name === name);
    if (index !== -1) return alert(`${capitalize(name)} is already a member.`);

    const newMember: MemberI = {
      name,
      type,
      active: false,
      works: [{ name: 'def', part: 'def', done: true }],
      free: false,
    };
    const newMembers: MemberI[] = [...members, newMember];

    dispatch(setMembers(newMembers));
    setName('');
    nameRef.current?.focus();
    db.setMember(newMember);
  };

  const handleMark = (member: MemberI) => {
    const newMember: MemberI = {
      ...member,
      free: !member.free,
      active: !member.active,
    };

    const index = members.indexOf(member);
    const newMembers = [...members];
    newMembers[index] = newMember;
    dispatch(setMembers(newMembers));
    db.updateMember(newMember);
  };

  const handleDelete = (name: string) => {
    const result = prompt('Are you sure?');
    if (result === null) return;
    const newMembers = members.filter((m) => m.name !== name);
    dispatch(setMembers(newMembers));
    db.deleteMember(name);
  };

  return (
    <Section>
      <header className='header'>
        <nav className='nav'>
          <Link to='/home' className='btn btn-link'>
            Back
          </Link>
        </nav>
        <form onSubmit={handleSubmit} className='form'>
          <input
            className='form-control'
            type='text'
            placeholder="member's name"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase())}
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
        <List items={members} title='all members' />
        <List items={activeMembers} title='active members' />
        <List items={inactiveMembers} title='inactive members' />
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
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid blue;
    margin: 10px;
  }

  @media print {
    .container,
    .header {
      display: none;
    }
    .hide {
      display: flex;
    }
  }
`;

export default MembersComp;
