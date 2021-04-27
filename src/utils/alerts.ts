import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const swali = (text?: any, title = 'Info') => {
  MySwal.fire(title, `${text}`);
};

export const swale = (text?: any, title = 'Error') => {
  MySwal.fire(title, `${text}`, 'error');
};

export const swals = (text?: any, title = 'Success') => {
  MySwal.fire({
    title,
    text: `${text}`,
    icon: 'success',
    showConfirmButton: false,
    timer: 2000,
  });
};

const t = `You won't be able to revert this!`;

export const swalconfirm = (btnText: string, text = t) => {
  return Swal.fire({
    title: 'Are you sure?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: btnText,
  });
};
