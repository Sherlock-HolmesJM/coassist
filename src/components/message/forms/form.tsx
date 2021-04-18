import styled from 'styled-components';

export interface FormProps {
  filename: string;
}

const Form = styled.div`
  position: absolute;
  top: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min(94vw, 500px);
  background: gray;
  margin: 10px;
  z-index: 111;

  .form-select {
    outline: none;
    border: none;
    border-bottom: 1px solid gray;
    color: gray;
  }
  .header-splitlength-div {
    display: flex;
  }
  .header-label {
    margin-right: 10px;
  }
  .header-splitlength {
    outline: none;
    border: none;
    border-bottom: 1px solid gray;
    width: 50px;
    color: gray;
    font-size: 18px;
  }
  .form-control {
    flex-basis: clamp(310px, 50%, 400px);
    text-transform: uppercase;
    border: 2px gray red;
  }
  .form-split {
    outline: none;
    border: none;
    border-bottom: 1px solid gray;
    width: 40px;
    text-transform: uppercase;
  }
  .form-btn-div {
    display: flex;
    justify-content: center;
  }
  .form-close-btn-div {
    display: flex;
    justify-content: flex-end;
  }
`;

export { Form };
export default Form;
