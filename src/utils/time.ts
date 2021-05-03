/**
 *
 * @param capacity in seconds
 * @returns formatted time.
 */
export const formatCap = (capacity: number) => {
  const mins = secondsToMinutes(capacity);
  if (mins < 60) return `${+mins}min`;

  const { h, m } = secondsToHMS(capacity);

  if (+m < 1) return `${+h}hr`;
  return `${+h}hr ${+m}min`;
};

export const secondsToMinutes = (seconds: number) => {
  if (isNaN(seconds)) return 0;
  if (!seconds) return 0;
  if (seconds < 1) return 0;
  return Math.floor(seconds / 60);
};

/**
 *
 * @param seconds time in seconds
 * @returns returns the hour, minute and second from seconds
 */
export const secondsToHMS = (seconds: number) => {
  if (seconds === 0) return { h: '00', m: '00', s: '00' };

  const h = toTwoDigits(Math.floor(seconds / 3600));
  const m = toTwoDigits(Math.floor((seconds / 60) % 60));
  let s = Math.floor(seconds - (+h * 3600 + +m * 60));

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
  try {
    return +h * 3600 + +m * 60 + +s;
  } catch (e) {
    return 0;
  }
};

/**
 * A function to convert time in h:m:s to seconds.
 * @param time h:m:s
 * @returns time in seconds.
 */
export const timeToSeconds = (time: string) => {
  const [h, m, s] = time.split(':');
  return hmsToSeconds(h, m, s);
};

export const toTwoDigits = (num: number) => (num < 10 ? '0' + num : num + '');
