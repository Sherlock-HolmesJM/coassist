/**
 *
 * @param start any number
 * @param end any number >= 0
 * @returns returns an array of numbers from start (>= 0) to end [inclusive]
 */
export const range = (start = 0, end: number) => {
  if (end < 0) throw new Error('end must be greater than or equal to zero');

  const range = [...new Array(end + 1).keys()];
  if (start <= 0) return range;
  return range.filter((v) => v >= start);
};

export default range;
