import { ChangeEvent } from 'react';

type HMS = 'h' | 'm' | 's';

export interface TimeProps {
  time: { h: string; m: string; s: string };
  setTime: (type: HMS, value: number) => void;
  placeholder?: string;
}

const Time: React.FC<TimeProps> = (props) => {
  const { h, m, s } = props.time;
  const { setTime, placeholder } = props;

  const handleChangeFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, dataset } = e.target;
    const t = dataset.type;
    const type = t === 'h' ? 'm' : t === 'm' ? 's' : 'size';

    if (value.length === 2)
      (document.querySelector(`.focus.${type}`) as any)?.focus();
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type } = e.target.dataset;
    setTime(type as HMS, +e.target.value);
  };

  return (
    <div className='m-2'>
      <div
        className='form-control duration-holder'
        onChange={handleChangeFocus}
      >
        <p style={{ marginRight: '10px' }}>
          {placeholder ?? 'Duration (H:M:S)'}
        </p>
        <Input value={+h} type='h' handleTimeChange={handleTimeChange} />:
        <Input value={+m} type='m' handleTimeChange={handleTimeChange} />:
        <Input value={+s} type='s' handleTimeChange={handleTimeChange} />
      </div>
    </div>
  );
};

interface InputProps {
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: number;
  type: string;
}

const Input: React.FC<InputProps> = (props) => {
  const { value, type, handleTimeChange } = props;

  return (
    <input
      type='number'
      placeholder='00'
      data-type={type}
      required
      value={value}
      className={`duration focus ${type}`}
      onFocus={(e) => e.target.select()}
      onChange={handleTimeChange}
    />
  );
};

export default Time;
