import Lottie from 'lottie-react';
import styled from 'styled-components';
import { homeBot } from '../media';
import { Link } from 'react-router-dom';
import { signOut } from '../services/auth';
import { useContext } from 'react';
import { context } from '../context/context';
import { setCG } from '../context/actions';
import { updateCGNames } from '../services/database';

export interface Props {}

const Home: React.FC<Props> = (props) => {
  const { collatorName, groupName, dispatch } = useContext(context);

  const handleChange = (e: any, collatorName: string, groupName: string) => {
    collatorName =
      collatorName === '' ? "collator's name" : collatorName.toLowerCase();
    groupName = groupName === '' ? 'group name' : groupName.toLowerCase();

    if (e.key === 'Enter') {
      dispatch(setCG(collatorName, groupName));
      updateCGNames(collatorName, groupName);
    }
  };

  return (
    <Section>
      <header className='header'>
        <div className='header-content'>
          <h1 className='header-title'>Collator's Assistant</h1>
          <h4 className='header-welcome'>
            <em>Welcome Collator</em>
          </h4>
        </div>
        <Lottie className='bot' animationData={homeBot} />
      </header>
      <main className='main'>
        <div className='list-group'>
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
            onClick={signOut}
            className='list-group-item list-group-item-action'
          >
            Logout
          </button>
        </div>
      </main>
    </Section>
  );
};

const Section = styled.section`
  .header {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    border-bottom: 1px groove gray;
  }
  .header-content {
    padding: 20px;
    text-align: center;
  }
  .header-title {
    font-size: clamp(1.2rem, 5vw, 2.5rem);
  }
  .header-welcome {
    font-size: clamp(1rem, 4vw, 1.5rem);
    color: gray;
  }
  .input-text {
    text-transform: capitalize;
  }
  .bot {
    flex-basis: min(100px, 50%);
    margin: 10px;
    background: gray;
    border-radius: 10px;
  }

  .main {
    display: flex;
    justify-content: center;
  }
  .list-group {
    width: min(400px, 100%);
    margin: 20px;
  }
`;

export default Home;
