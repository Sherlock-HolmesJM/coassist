import range from './range';

const isLeapYear = (year: number) => {
  /**
 * 
 How to know if it is a Leap Year: 
 Leap Years are any year that can be exactly divided by 4 (such as 2016, 2020, 2024, etc) 
 except if it can be exactly divided by 100, then it isn't (such as 2100, 2200, etc) 
 except if it can be exactly divided by 400, then it is (such as 2000, 2400)
 */

  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
};

const getLastDayofMonth = (year: number, month: number) => {
  // Note: Month, Jan = 1, Feb = 2, ...
  if (month === 2) return isLeapYear(year) ? 29 : 28;

  // const _30days = ['Sep', 'Apr', 'Jun', 'Nov'];
  const _30days = [9, 4, 6, 11];

  return _30days.some((mon) => mon === month) ? 30 : 31;
};

const to2digits = (num: number) => (num < 10 ? '0' + num : '' + num);

type WeekBegins = 'Mon' | 'Tue' | 'Wed' | 'Thur' | 'Fri' | 'Sat' | 'Sun';

/**
 *
 * @param weekBegins anything from Mon to Sun.
 * @param date optional. Uses today's date if not provided.
 * @returns date of when week began based on input
 */
export const getWeekBegin = (
  weekBegins: WeekBegins = 'Sat',
  date = new Date()
): Date => {
  let [day, , d] = date.toDateString().split(' ');

  if (day === weekBegins) return date;

  let [y, m] = date.toJSON().split('-');

  m = (+d - 1 === 0 ? +m - 1 : m) + '';
  y = (+m === 0 ? +y - 1 : y) + '';
  m = (+m === 0 ? 12 : m) + '';
  d = (+d - 1 === 0 ? getLastDayofMonth(+y, +m) : +d - 1) + '';

  const newDate = `${y}-${to2digits(+m)}-${to2digits(+d)}`;

  return getWeekBegin(weekBegins, new Date(newDate));
};

/**
 *
 * @param date of when week begins
 * @returns date of the seventh day of the week based on input
 */
export const getWeekEnd = (date: Date) => {
  let [, , d] = date.toDateString().split(' ');
  let [y, m] = date.toJSON().split('-');

  let dm = +d + 6; // day of month
  let month = +m;
  let year = +y;
  const ldm = getLastDayofMonth(+y, +m);

  if (dm > ldm) {
    dm = dm - ldm;
    year = month + 1 === 13 ? ++year : year;
    month = month + 1 === 13 ? 1 : month + 1;
  }

  const newDate = `${year}-${to2digits(month)}-${to2digits(dm)}`;
  return new Date(newDate);
};

export const checkDate = (date: Date, weekbegan: Date, weekends: Date) => {
  const today = date.toDateString().split(' ')[2];

  if (!today) return false;

  const began = weekbegan.toDateString().split(' ')[2];
  const ends = weekends.toDateString().split(' ')[2];

  return range(+began, +ends).some((day) => day === +today);
};
