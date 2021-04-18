/**
 *
 * @param seconds time in seconds
 * @returns returns the hour, minute and second from seconds
 */
export const secondsToHMS = (seconds: number) => {
  const h = toTwoDigits(Math.floor(seconds / 3600));
  const m = toTwoDigits(Math.floor((seconds / 60) % 60));
  let s = Math.floor(seconds - (1 * 3600 + +m * 60));

  s = s > 59 ? s % 60 : s;

  return { h, m, s: toTwoDigits(s) };
};

export const toTwoDigits = (num: number) => (num < 10 ? '0' + num : num + '');
