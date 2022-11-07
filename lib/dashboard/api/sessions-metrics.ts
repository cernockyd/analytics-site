import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import {
  delta,
  deltaType,
  KPIData,
  KPIDataDuration,
  rangesForComparison,
} from 'lib/utils';
import * as duration from 'duration-fns';

export type QueryRow = {
  session_count: number;
  avg_duration: string;
  category: string;
};

export type SessionsMetrics = {
  duration: KPIDataDuration;
  count: KPIData;
};

export default async function getSessionsMetrics(
  slug: string,
  filter: ServerFilterData
): Promise<SessionsMetrics> {
  const domain = getDomain(slug);
  const { currentRange, compareRange, totalRange } = rangesForComparison(
    filter.dateInterval
  );
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      events_with_time_difference_between_user_events as (
        select distinct
          client_id,
          time,
          time - lag(time, 1) over (order by time) as diff
        from events
        where
          domain=$1
          AND time::date <@ $2::daterange
        group by client_id, time
      ),
      events_with_session_number as (
        select
          client_id,
          time,
          sum(
            case when diff is null or diff < '30 min' then 0 else 1 end
          ) over (partition by client_id order by time) as session_no
        from events_with_time_difference_between_user_events
        group by client_id, time, diff
      ),
      sessions_with_duration_and_category as (
        select
          client_id,
          min(time) as start_time,
          max(time) as end_time,
          max(time) - min(time) as duration,
          case
            when max(time)::date <@ $3::daterange then 'current'
            when max(time)::date <@ $4::daterange then 'compare'
          end category
        from events_with_session_number
        group by client_id, session_no
      ),
      average_session_duration as (
        select
          category,
          count(*) as session_count,
          avg(duration) as avg_duration
        from sessions_with_duration_and_category
        group by category
      )
    select
      *
    from average_session_duration
  `,
    [domain, totalRange, currentRange, compareRange]
  );

  type DataItem = {
    count?: number;
    duration?: Duration;
  };

  type ReduceResult = {
    current?: DataItem;
    compare?: DataItem;
  };
  const defaultData = {
    current: { count: 0, duration: undefined },
    compare: { count: 0, duration: undefined },
  };
  const data = rows.reduce<ReduceResult>((accumulator, current) => {
    return {
      ...accumulator,
      [current.category]: {
        count: current.session_count,
        duration: duration.parse(current.avg_duration),
      },
    };
  }, defaultData);
  const sessionsChange = delta(data.current?.count, data.compare?.count);
  const durationChange = delta(
    duration.toMilliseconds(data.current?.duration),
    duration.toMilliseconds(data.compare?.duration)
  );
  const durationResult: KPIDataDuration = {
    metric: data.current?.duration,
    metricPrev: data.compare?.duration,
    delta: durationChange,
    deltaType: deltaType(durationChange),
    type: 'duration',
  };
  const sessionsResult: KPIData = {
    metric: data.current?.count,
    metricPrev: data.compare?.count,
    delta: sessionsChange,
    deltaType: deltaType(sessionsChange),
    type: 'number',
  };
  return {
    duration: durationResult,
    count: sessionsResult,
  };
}
