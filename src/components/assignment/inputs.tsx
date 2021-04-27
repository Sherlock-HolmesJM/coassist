import React, { ChangeEvent, FC } from 'react';
import { Howl } from 'howler';
import { swale, swali, swals } from '../../utils';

export interface SelectProps {
  onChange: (e: any) => void;
  values: [string | number, string][];
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
            onChange={onChange}
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

export interface SizeProps {
  value: number;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
