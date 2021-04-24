import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const swale = (text: string) => MySwal.fire('Error', text, 'error');

type CB = (name: string, size: number, duration: number) => void;

export const getFileDetails = (file: File, cb: CB) => {
  const audio = document.createElement('audio');

  if (!file) {
    swale(`File is ${file}. Try again.`);
    return cb('', 0, 0);
  }
  if (file.type !== 'audio/mpeg') {
    swale('Invalid file type. Try again with audio files.');
    return cb('', 0, 0);
  }

  const name = file.name.replace('.mp3', '');
  const size = Math.floor(file.size / 1024 / 1024);

  const reader = new FileReader();

  reader.onload = (e) => {
    audio.src = e.target.result as any;
    audio.onloadedmetadata = () => cb(name, size, audio.duration); // audio.duration is in seconds
    MySwal.fire({
      title: 'Success',
      text: 'Successfully read file details',
      icon: 'success',
    });
  };

  reader.onerror = (e) => {
    cb(name, size, 0);
    MySwal.fire(
      'Duration Error',
      'An error occured while reading duration from file.',
      'error'
    );
  };

  const memory = (navigator as any).deviceMemory;

  if (size <= 200 && memory > 1) reader.readAsDataURL(file);
  else {
    cb(name, size, 0);
    MySwal.fire(
      'Info',
      'Cannot read duration because file size is too large or memory is too low. Please get the duration yourself.',
      'info'
    );
  }
};
