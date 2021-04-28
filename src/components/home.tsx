import { useContext, useState } from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';
import { homeBot } from '../media';
import { Link } from 'react-router-dom';
import { signOut } from '../services/auth';
import { context, State } from '../context/context';
import { setCG, setState, toggleSpin } from '../context/actions';
import Summary from './summary';
import Loader from '../commons/loader';
import { db } from '../services/database';
import { getExcel } from '../utils/report';
import Report from './report';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { capitalize } from '../utils';
import { puff } from '../media';

export interface Props {}

const Home: React.FC<Props> = () => {
  const { collatorName, groupName, dispatch, spin, messages } = useContext(
    context
  );
  const [report, setReport] = useState(false);
  const [selfspin, setSpin] = useState(false);

  const handleExcelReport = async () => {
    // const url = 'http://localhost:5000/api/excel';
    const url = 'https://coassist.herokuapp.com/api/excel';
    try {
      setSpin(true);
      const { data } = await axios.get(url);
      const buffer = await getExcel(data.data, messages, collatorName);
      const filename = `Transcript_Collator_${capitalize(collatorName)}.xlsx`;
      saveAs(new Blob([buffer]), filename);
      setSpin(false);
    } catch (e) {
      alert(e);
    }
  };

  const handleChange = (e: any, collatorName: string, groupName: string) => {
    if (e.key !== 'Enter') return;

    collatorName =
      collatorName === '' ? "collator's name" : collatorName.toLowerCase();
    groupName = groupName === '' ? 'group name' : groupName.toLowerCase();
    dispatch(setCG(collatorName, groupName));
    db.updateCGNames(collatorName, groupName);
  };

  const handleReload = () => {
    dispatch(toggleSpin(true));
    db.getData().then((data) => {
      dispatch(setState(data as State));
    });
  };

  return (
    <Section>
      <Loader spin={selfspin} />
      <header className='header no-print'>
        <div className='header-content'>
          <h1 className='header-title'>Collator's Assistant</h1>
          <h4 className='header-welcome'>
            <em>What would you like to do next?</em>
          </h4>
        </div>
        <div className='bot'>
          <Lottie animationData={homeBot} onClick={handleReload} />
          <img src={spin ? puff : ''} alt='' className='bot-loader' />
        </div>
      </header>
      <main className='main'>
        <Summary />
        <div className='list-group no-print'>
          <input
            type='text'
            className='list-group-item input-text'
            placeholder={groupName}
            onKeyPress={(e) =>
              handleChange(e, collatorName, e.currentTarget.value.trim())
            }
          />
          <input
            type='text'
            className='list-group-item input-text'
            placeholder={collatorName}
            onKeyPress={(e) =>
              handleChange(e, e.currentTarget.value.trim(), groupName)
            }
          />
          <Link
            to='/members'
            className='list-group-item list-group-item-action'
            aria-current='true'
          >
            Members
          </Link>
          <Link
            to='/assignments'
            className='list-group-item list-group-item-action'
          >
            Assignments
          </Link>
          <button
            onClick={() => setReport(!report)}
            className='list-group-item list-group-item-action'
          >
            report
          </button>
          <button
            className='list-group-item list-group-item-action'
            onClick={handleExcelReport}
          >
            excel report
          </button>
          <button
            onClick={signOut}
            className='list-group-item list-group-item-action'
          >
            Logout
          </button>
        </div>
        <Report report={report} />
      </main>
    </Section>
  );
};

const Section = styled.section`
  background-color: inherit;

  .header {
    display: flex;
    justify-content: space-evenly;
    border-bottom: 1px groove gray;
  }
  .header-content {
    padding: 20px;
    text-align: center;
  }
  .header-title {
    font-size: clamp(1.2rem, 4vw, 2.5rem);
  }
  .header-welcome {
    font-size: clamp(0.8rem, 3vw, 1.5rem);
    color: gray;
  }
  .input-text {
    text-transform: capitalize;
  }
  .bot {
    position: relative;
    flex-basis: min(100px, 60%);
    margin: 10px;
    background: gray;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .bot-loader {
    position: absolute;
    width: 100%;
  }

  .main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 10px;
    padding: 10px;
  }
  .list-group {
    margin-bottom: 20px;
    width: min(90vw, 310px);
  }
  .list-group * {
    text-transform: capitalize;
  }

  @media print {
    .no-print {
      display: none;
    }
  }
`;

export default Home;
