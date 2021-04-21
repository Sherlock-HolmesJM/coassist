/**
 *
 * @param seconds time in seconds
 * @returns returns the hour, minute and second from seconds
 */
export const secondsToHMS = (seconds: number) => {
  if (seconds === 0) return { h: '00', m: '00', s: '00' };

  const h = toTwoDigits(Math.floor(seconds / 3600));
  const m = toTwoDigits(Math.floor((seconds / 60) % 60));
  let s = Math.floor(seconds - (1 * 3600 + +m * 60));

  s = s > 59 ? s % 60 : s;

  return { h, m, s: toTwoDigits(s) };
};

/**
 * A function to convert time from h:m:s to seconds.
 * @param h hour
 * @param m minute
 * @param s second
 * @returns seconds.
 */
export const hmsToSeconds = (h: string, m: string, s: string) => {
  if (h && m && s) return +h * 3600 + +m * 60 + +s;
  return 0;
};

export const toTwoDigits = (num: number) => (num < 10 ? '0' + num : num + '');
