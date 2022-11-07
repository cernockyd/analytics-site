import {
  formatISO9075,
  formatISO,
  startOfToday,
  startOfYear,
  Duration,
  format,
  intervalToDuration,
  isBefore,
  sub,
} from 'date-fns';
import { ServerDateInterval } from 'lib/dashboard/hooks/use-dashboard-data';

export const allowedKpis = [
  'readers',
  'session-duration',
  'read-to-end',
  'pageviews',
  'sessions',
  'bounce-rate',
] as const;

export type KPIType = typeof allowedKpis[number];

export interface KPIData {
  metric: number;
  metricPrev: number;
  deltaType: DeltaType;
  delta: number;
  unit?: string;
  type: 'number' | 'percent';
}

export interface KPIDataDuration
  extends Omit<KPIData, 'metric' | 'metricPrev' | 'type'> {
  metric: Duration;
  metricPrev: Duration;
  type: 'duration';
}

export type Bar = {
  name: string;
  value: number;
};

export type BarListData = Bar[];

export enum TrafficType {
  Visitor = 'visitor',
  PageView = 'pageview',
}

export function getPreviousInterval(interval: ServerDateInterval) {
  const duration = intervalToDuration(interval);
  const prevEnd = sub(interval.start, { days: 1 });
  const prevStart = sub(prevEnd, duration);
  return { start: prevStart, end: prevEnd };
}

export function range(interval: ServerDateInterval) {
  return `[${formatISO9075(interval.start)}, ${formatISO9075(interval.end)}]`;
}

export function rangesForComparison(interval: ServerDateInterval) {
  const prevInterval = getPreviousInterval(interval);
  const currentRange = range(interval);
  const compareRange = range(prevInterval);
  const totalRange = range({ start: prevInterval.start, end: interval.end });
  return {
    currentRange,
    compareRange,
    totalRange,
  };
}

export function delta(current: number, prev = 0) {
  if (prev == 0) return 0;
  return current / prev - 1;
}

export enum DeltaType {
  Increase = 'increase',
  ModerateIncrease = 'moderateIncrease',
  Decrease = 'decrease',
  ModerateDecrease = 'moderateDecrease',
  Unchanged = 'unchanged',
}

export function deltaType(delta: number): DeltaType {
  if (delta >= 0.1) return DeltaType.Increase;
  if (delta > 0) return DeltaType.ModerateIncrease;
  if (delta === 0) return DeltaType.Unchanged;
  if (delta <= -0.1) return DeltaType.Decrease;
  return DeltaType.ModerateDecrease;
}

export const allowedGranularity = ['year', 'month', 'day', 'hour'];
export type Granularity = typeof allowedGranularity[number];

export function granularDateTime(
  date: string,
  duration: Duration,
  today: Date,
  thisYear: Date
): string {
  // https://date-fns.org/v2.29.3/docs/format
  const dateObj = new Date(date);
  return format(
    dateObj,
    ((): string => {
      if (isBefore(dateObj, thisYear)) {
        if (duration.years) return 'yy';
        if (duration.months >= 3) return 'd MMM yy';
        if (duration.days > 1) return 'd MMM yy';
      }
      if (duration.years) return 'y';
      if (duration.months >= 3) return 'MMM';
      if (duration.months > 1) return 'd MM';
      if (duration.days > 1) return 'd MMM ';
    })()
  );
}

export function granularityForInterval(duration: Duration): Granularity {
  if (duration.years >= 1) return 'year';
  if (duration.months >= 3) return 'month';
  if (duration.days > 1) return 'day';
  return 'hour';
}

export type ChartPoint = { [key: string]: number | string };

export type ChartDataCategory = {
  name: string;
  unit: 'seconds' | 'percentage' | 'number';
};

export type ChartData = {
  points: ChartPoint[];
  key: string;
  categories: ChartDataCategory[];
};

export function inTime(dateInterval: ServerDateInterval) {
  const duration = intervalToDuration(dateInterval);
  const today = startOfToday();
  const thisYear = startOfYear(today);
  const granularity = granularityForInterval(duration);
  const interval = '1 ' + granularity;
  const { currentRange } = rangesForComparison(dateInterval);
  const startDateString = formatISO(dateInterval.start);
  const endDateString = formatISO(dateInterval.end);
  const key = granularity.charAt(0).toUpperCase() + granularity.slice(1);
  return {
    duration,
    today,
    thisYear,
    granularity,
    interval,
    currentRange,
    startDateString,
    endDateString,
    key,
  };
}
