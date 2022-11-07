import { DateInterval } from '../dashboard/hooks/use-dashboard-data';

/**
 * @returns formated interval YYYY-MM-DD suitable for url query params
 */
export function urlInterval(interval: DateInterval) {
  const start = interval.start.toString();
  const end = interval.end.toString();
  return { start, end };
}
