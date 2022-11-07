import { formatDuration } from 'date-fns';

export const percentageOptions = {
  style: 'percent',
  maximumFractionDigits: 0,
};

export function percentageFormatter(number: number) {
  return `${Intl.NumberFormat('us', percentageOptions).format(number)}`;
}

const formatDistanceLocale = {
  xSeconds: '{{count}} s',
  xMinutes: '{{count}} m',
  xHours: '{{count}} h',
};

const shortEnLocale = {
  formatDistance: (token, count) =>
    formatDistanceLocale[token].replace('{{count}}', count),
};

export function shortDuration(metric: Duration) {
  return formatDuration(metric, {
    format: ['hours', 'minutes', 'seconds'],
    locale: shortEnLocale,
  });
}
