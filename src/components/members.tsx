import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import List from '../commons/list';
import { Link } from 'react-router-dom';
import { capitalize } from '../util';
import { context } from '../context/context';
import { setMembers } from '../context/actions';
import { MemberI, MemberType } from '../types/member';

export interface MembersProps {}

const MembersComp: React.FC<MembersProps> = (props) => {
  const { dispatch, members } = useContext(context);

  const [name, setName] = useState('');
  const [type, setType] = useState<MemberType>('T');

  const nameRef = useRef<HTMLInputElement>(null);

  const activeMembs = Object.entries(members)
    .filter((m) => m[1].status === 'active')
    .reduce((a: MemberI[], n) => [...a, n[1]], []);

  const inactiveMembers = Object.entries(members)
    .filter((m) => m[1].status === 'inactive')
    .reduce((a: MemberI[], n) => [...a, n[1]], []);

  const list = Object.entries(members).reduce(
    (a: MemberI[], n) => [...a, n[1]],
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (members[name]) return alert(`${capitalize(name)} is already a member.`);

    const newMember: MemberI = {
      name,
      type,
      status: 'inactive',
      works: {},
      free: false,
    };
    const newMembers = { ...members, [name]: newMember };

    dispatch(setMembers(newMembers));
    setName('');
    nameRef.current?.focus();
  };

  const handleMark = (member: MemberI) => {
    const newMember = { ...member, free: !member.free };
    newMember.status = newMember.status === 'active' ? 'inactive' : 'active';

    const newMembers = { ...members };
    newMembers[member.name] = newMember;
    dispatch(setMembers(newMembers));
  };

  const handleDelete = (name: string) => {
    const result = prompt('Are you sure?');
    if (result === null) return;
    const newMembers = { ...members };
    delete newMembers[name];
    console.log(newMembers);

    dispatch(setMembers(newMembers));
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
          items={activeMembs}
          title='active members'
          onMark={handleMark}
          onDelete={handleDelete}
        />
      </div>
      <div className='hide'>
        <List items={list} title='all members' />
        <List items={activeMembs} title='active members' />
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
