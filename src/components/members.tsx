import React, { useState } from "react";
import styled from "styled-components";
import List from "../commons/list";
import { Link } from "react-router-dom";

export interface MembersProps {}

const Members: React.FC<MembersProps> = (props) => {
  const [list, setList] = useState<string[]>(["ugochukwu"]);
  const [members, setMembers] = useState<string[]>(["sister ibim"]);
  const [member, setMember] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      const l = [...list];
      l.push(member);
      setList(l);
    }
  };

  return (
    <Section>
      <header className="header">
        <nav className="nav">
          <Link to="/home" className="btn btn-link">
            back
          </Link>
        </nav>
        <form onSubmit={handleSubmit} className="form">
          <input
            className="form-control"
            type="text"
            placeholder="member's name"
            onChange={(e) => setMember(e.target.value.toLowerCase())}
          />
          <input className="btn btn-primary" type="submit" value="Add" />
        </form>
      </header>
      <div className="container">
        <List items={list} title="inactive members" />
        <List items={members} title="active members" />
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

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .container > * {
    margin: 20px;
    flex-basis: 400px;
  }
`;

export default Members;
