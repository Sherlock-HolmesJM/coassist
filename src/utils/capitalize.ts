/**
 *
 * @param value string
 * @returns capitalize first letter in each word of a string.
 */

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

export default capitalize;
