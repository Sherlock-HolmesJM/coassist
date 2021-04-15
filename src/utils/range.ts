/**
 *
 * @param start >= 0
 * @param end inclusive
 * @returns returns an array of numbers from start to end all inclusive
 */
export const range = (start = 0, end: number) => {
  const range = [...new Array(end + 1).keys()];
  if (start > 0) return range.filter((v) => v >= start);
  return range;
};
