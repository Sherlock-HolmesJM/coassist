import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { capitalize } from '../util';

interface Props {}

function Assignment(props: Props) {
  // const {} = props;

  const [filename, setFilename] = useState('');
  const [list, setList] = useState<string[]>(['kdkdkdk']);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const index = list.indexOf(filename);
    if (index !== -1)
      return alert(`${capitalize(filename)} is already being worked on.`);

    const newList = [...list];
    newList.push(filename);
    setList(newList);
    setFilename('');
    fileRef.current?.focus();
  };

  const handleDelete = (item: string) => {
    const result = prompt('Are you sure?');
    if (result === null) return;
    const newList = list.filter((i) => i !== item);
    setList(newList);
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
            placeholder='filename'
            value={filename}
            onChange={(e) => setFilename(e.target.value.toLowerCase())}
            required
            ref={fileRef}
          />
          <input className='btn btn-primary' type='submit' value='Add' />
        </form>
      </header>
      <main className='list-container'>
        <ul className='list-group'>
          {list.map((l) => (
            <li key={l} className='list-group-item'>
              <Link to={`/assignments:${l}`} className='link'>
                {l}
              </Link>
              <span className='badge bg-danger' onClick={() => handleDelete(l)}>
                X
              </span>
            </li>
          ))}
        </ul>
      </main>
    </Section>
  );
}

const Section = styled.section`
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

  .badge {
    float: right;
    cursor: pointer;
    color: white;
  }
  .list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .list-container > * {
    flex-basis: 400px;
  }
  .list-group-item {
    text-transform: uppercase;
  }
  .link {
    color: gray;
    text-decoration: none;
  }
  .link:visited {
    color: gray;
  }
`;

export default Assignment;
