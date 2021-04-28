import styled from 'styled-components';
import Loader from './loader';

export interface HolderProps {
  props: {
    setShow: (value: any) => void;
    show: any;
    spin: boolean;
  };
}

interface FormModalButtonProps {
  value: string;
  onClick: () => void;
}

export const FormModalButton: React.FC<FormModalButtonProps> = (props) => {
  const { value, onClick } = props;
  return (
    <a
      href='#form-modal'
      className='btn btn-primary'
      type='button'
      onClick={onClick}
    >
      {value}
    </a>
  );
};

const Holder: React.FC<HolderProps> = (props) => {
  const { setShow, show, spin } = props.props;

  if (!show) return null;

  return (
    <Div>
      <Loader spin={spin} />
      <div className='fixed' id='form-modal'>
        <div className='btn-close-div'>
          <FormModalButton value='X' onClick={() => setShow(false)} />
        </div>
        {props.children}
      </div>
    </Div>
  );
};

const Div = styled.div`
  position: relative;
  top: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 111;

  .fixed {
    position: fixed;
    top: 0;
    display: flex;
    flex-direction: column;
    width: min(94vw, 500px);
    background-color: gray;
    padding: 5px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.8s;
  }
  .fixed:target {
    animation: fixed 0.5s ease both;
  }
  @keyframes fixed {
    0% {
      top: 0;
    }
    100% {
      top: 150px;
      opacity: 1;
      visibility: visible;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
  }
  .form-control {
    flex-basis: clamp(310px, 50%, 400px);
    text-transform: uppercase;
    border: 2px gray red;
  }
  .form-control-select {
    background: white;
    border-radius: 5px;
    padding: 5px;
    color: gray;
  }
  .form-select {
    text-transform: capitalize;
    outline: none;
    border: none;
    width: 100%;
  }
  .holder-label {
    margin-right: 10px;
  }
  .holder-splitlength-div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    padding: 5px 12px;
    border-radius: 5px;
  }
  .holder-splitlength-label {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    text-transform: uppercase;
  }
  .holder-splitlength {
    width: 40px;
    outline: none;
    border: none;
    border-bottom: 1px solid gray;
    text-align: center;
    margin: 0;
    padding: auto 0;
    text-transform: uppercase;
  }
  .header-actionButton-holder {
    display: flex;
  }
  .header-actionButton-holder * {
    text-transform: uppercase;
  }
  .btn-close-div {
    display: flex;
    justify-content: flex-end;
  }
  .duration-holder {
    display: flex;
  }
  .duration {
    width: 30px;
    outline: none;
    border: none;
    padding: 6px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .select {
    outline: none;
    border-radius: 5px;
    color: gray;
    border: none;
    margin: 0;
  }
`;

export default Holder;
