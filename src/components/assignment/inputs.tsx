import { ChangeEvent, FC } from 'react';

export interface SizeProps {
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SizeInput: FC<SizeProps> = (props) => {
  const { value, onChange } = props;

  return (
    <div className='m-2'>
      <input
        className='form-control size focus'
        type='number'
        placeholder='size (MB)'
        value={value}
        onChange={onChange}
        required
        onFocus={(e) => e.currentTarget.select()}
      />
    </div>
  );
};

// Name Input
// Name Input

interface NameProps {
  value: string;
  setName: (name: string) => void;
}

export const NameInput: FC<NameProps> = (props) => {
  const { value, setName } = props;

  return (
    <div className='m-2'>
      <input
        className='form-control'
        type='text'
        placeholder='filename'
        required
        value={value}
        onChange={(e) => setName(e.target.value.trim().toLowerCase())}
      />
    </div>
  );
};

// File Input
// File Input

interface FileProps {
  onChange: (file: File) => void;
}

export const FileInput: FC<FileProps> = (props) => {
  const { onChange } = props;

  return (
    <div className='m-2'>
      <input
        className='form-control'
        type='file'
        placeholder='Get File(s)'
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
};
