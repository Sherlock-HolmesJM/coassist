/**
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

/**
 * @param text
 * @param limit
 * @param param to use for splitting text
 * @returns
 */
export const clipText = (text: string, limit = 20, param = '-') => {
  if (text.length <= limit) return text;

  const arr = text.split(param);
  let result = '';

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i].length + result.length > limit) break;
    result = result + ' ' + arr[i];
  }

  return result + '...-';
};
