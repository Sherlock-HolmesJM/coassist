import { createTorTE, MessageI, Worker } from '../../types';
import { swale, swali } from '../../utils';
import { db } from '../../services';
import { Howl } from 'howler';

export const updateWorkers = (name: string, workers: Worker[]) => {
  workers.forEach((w) => {
    w.part = w.part.replace(w.msgname, name);
    w.msgname = name;
  });
  db.updateWorkers(workers);
};

type CB = (name: string, size: number, duration: number) => void;

export const getFileDetails = (file: File, cb: CB) => {
  if (!file) {
    swale(`File is ${file}. Try again.`);
    return cb('', 0, 0);
  }
  // if (file.type !== 'audio/mpeg') {
  //   swale('Invalid file type. Try again with audio files.');
  //   return cb('', 0, 0);
  // }

  const name = file.name.replace('.mp3', '');
  const size = Math.floor(file.size / 1024 / 1024);

  const reader = new FileReader();

  reader.onload = (e) => {
    // audio.src = e.target.result as any;
    // audio.onloadedmetadata = () => {
    //   swals('Read file details');
    //   cb(name, size, audio.duration); // audio.duration is in seconds
    // };
    console.log('here');
    const sound = new Howl({
      src: e.target.result as any,
    });
    sound.on('load', () => {
      console.log(sound.duration());
      sound.play();
    });
  };

  reader.onerror = (e) => {
    cb(name, size, 0);
    swale(e.target.result as string, 'Duration error');
  };

  const memory = (navigator as any).deviceMemory;

  if (size <= 200 && memory > 1) reader.readAsDataURL(file);
  else {
    cb(name, size, 0);
    swali(
      'Cannot read duration because file size is too large or memory is too low. Please get it yourself.'
    );
  }
};

export const determineSent = (message: MessageI, sent: 'yes' | 'no' | '') => {
  return message.transcribed === 'yes' && message.edited === 'yes' ? sent : '';
};

// eslint-disable-next-line
export const addMissingProps = (messages: MessageI[]) => {
  messages.forEach((m) => {
    m.duration = m.duration || 0;
    m.originalLength = m.originalLength || '00:00:00';
    m.transcriber = m.transcriber || createTorTE('T');
    m.transcriptEditor = m.transcriptEditor || createTorTE('TE');
    m.transcribed = m.transcribed || 'no';
    m.edited = m.edited || 'no';
    m.category = 'sermon';
    m.size = m.size || 0;
    m.splits = m.splits || 1;
    m.splitLength = m.splitLength || 0;
  });

  return messages;
};
