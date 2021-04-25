import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const swali = (text?: string, title = 'Info') => {
  MySwal.fire(title, text);
};

export const swale = (text?: string, title = 'Error') => {
  MySwal.fire(title, text, 'error');
};

export const swals = (text?: string, title = 'Success') => {
  MySwal.fire({
    title,
    text,
    icon: 'success',
    showConfirmButton: false,
    timer: 2000,
  });
};
