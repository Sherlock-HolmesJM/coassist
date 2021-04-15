export { summary } from './summary';
export { range } from './range';

export const capitalize = (value: string) => {
  if (!value) return '';
  if (value.trim() === '') return '';

  const list = value.trim().split(' ');

  const newList = list.map((item) => {
    const [first, ...others] = item.split('');
    return first.toUpperCase() + others.join('');
  });

  return newList.join(' ').trim();
};
