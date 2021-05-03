import React, { ChangeEvent, FC } from 'react';
import { Howl } from 'howler';
import { swale, swali, swals } from '../../utils';

export const DateInput: React.FC = (props) => {
  return <div></div>;
};

interface ActionButtonHolderProps {
  value: string;
}

const ActionButtonHolder: React.FC<ActionButtonHolderProps> = (props) => {
  const { value, children } = props;
  return (
    <div className='m-2 btn-group header-actionButton-holder'>
      {children}
      <input className='btn btn-primary' type='submit' value={value} />
    </div>
  );
};

export { ActionButtonHolder };

interface LabelTextFieldProps {
  label: string;
  value: string;
  type?: 'text' | 'number' | 'date';
  placeholder?: string;
  onChange: (value: string) => void;
}

export const LabelTextField: React.FC<LabelTextFieldProps> = (props) => {
  const { label, value, onChange, type, placeholder } = props;

  return (
    <div className='m-2'>
      <div className='holder-splitlength-div'>
        <label className='holder-splitlength-label' htmlFor='splitlength'>
          {label}
        </label>
        <input
          id='splitlength'
          type={type ?? 'text'}
          className='holder-splitlength'
          placeholder={placeholder ?? ''}
          value={value}
          onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
          required
        />
      </div>
    </div>
  );
};

interface SelectProps {
  onChange: (e: string) => void;
  values: string[][];
  label: string;
  value?: string;
}

export const Select: React.FC<SelectProps> = (props) => {
  const { onChange, label, values, value } = props;

  return (
    <div className='m-2'>
      <div className='form-control-select'>
        <div>{label}:</div>
        <div>
          <select
            value={value || ''}
            name='type'
            id='type'
            required
            className='form-select'
            onChange={(e) => onChange(e.target.value)}
          >
            {values.map((val, ind) => (
              <option key={ind} value={val[0]}>
                {val[1]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

interface SizeProps {
  value: number;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SizeInput: FC<SizeProps> = (props) => {
  const { value, onChange, placeholder } = props;

  return (
    <div className='m-2'>
      <input
        className='form-control size focus'
        type='number'
        placeholder={placeholder ?? 'size (MB)'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
        required
        onFocus={(e) => e.currentTarget.select()}
        min={0}
      />
    </div>
  );
};

// Name Input
// Name Input

interface NameProps {
  value: string;
  setName: (name: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const NameInput: FC<NameProps> = (props) => {
  const { value, setName, placeholder, required } = props;

  return (
    <div className='m-2'>
      <input
        className='form-control'
        type='text'
        placeholder={placeholder || 'filename'}
        required={required ?? true}
        value={value || ''}
        onChange={(e) => setName(e.target.value.trim().toLowerCase())}
      />
    </div>
  );
};

// File Input
// File Input

interface FileProps {
  callback: (name: string, size: number, duration: number) => void;
}

export const FileInput: FC<FileProps> = (props) => {
  const { callback } = props;

  const formats = ['mp3', 'aac', 'ogg'];

  const getFileInfo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files[0];

      const format = file.name.split('.').pop().toLowerCase();
      const size = Math.round(file.size / 1024 / 1024);
      const name = file.name.replace('.' + format, '');

      const memory = (navigator as any).deviceMemory;

      const isValid = formats.some((e) => e === format);
      if (!isValid) throw new Error('must be an audio file.');

      if (size > 200 || memory < 2) {
        swali('Could not get duration of audio.');
        return callback(name, size, 0);
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const sound = new Howl({
          src: e.target.result as any,
          format: [format],
          html5: true,
        });

        sound.on('load', () => {
          callback(name, size, sound.duration());
          swals('You may proceed.', 'Got details.');
        });
      };

      reader.readAsDataURL(file);
    } catch (e) {
      swale(e);
      callback('', 0, 0);
    }
  };

  return <input className='btn btn-info' type='file' onChange={getFileInfo} />;
};
