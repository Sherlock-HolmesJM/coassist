import { ChangeEvent, FC } from 'react';
import { Howl } from 'howler';
import { swale } from '../../utils';

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
        value={value || ''}
        onChange={(e) => setName(e.target.value.trim().toLowerCase())}
      />
    </div>
  );
};

// File Input
// File Input

// type CB = (name: string, size: number, duration: number) => void;

interface FileProps {
  callback: (name: string, size: number, duration: number) => void;
}

export const FileInput: FC<FileProps> = (props) => {
  const { callback } = props;

  const pickerOpts = {
    types: [
      {
        description: 'Audios',
        accept: {
          'audio/*': ['.mp3'],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  const getFileInfo = async () => {
    try {
      const [handle] = await (window as any).showOpenFilePicker(pickerOpts);
      const file = await handle.getFile();

      const namesplit = file.name.split('.');
      const format = namesplit[namesplit.length - 1].toLowerCase();

      const size = Math.round(file.size / 1024 / 1024);
      const name = file.name.replace('.mp3', '');

      const memory = (navigator as any).deviceMemory;

      if (memory < 2) return callback(name, size, 0);
      if (size > 200) return callback(name, size, 0);

      const reader = new FileReader();

      reader.onload = (e) => {
        const sound = new Howl({
          src: e.target.result as any,
          format,
          html5: true,
        });

        sound.on('load', () => {
          callback(name, size, sound.duration());
        });
      };

      reader.readAsDataURL(file);
    } catch (e) {
      swale(e.message);
      callback('', 0, 0);
    }
  };

  return (
    <input
      className='btn btn-info'
      type='button'
      value='Get File'
      onClick={getFileInfo}
    />
  );
};
