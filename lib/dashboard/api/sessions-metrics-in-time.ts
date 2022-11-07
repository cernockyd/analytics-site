import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import getDomain from 'lib/domain';
import sql from 'lib/postgres';
import {
  granularDateTime,
  inTime,
  ChartData,
  ChartDataCategory,
} from '../../utils';
import * as fnsDuration from 'duration-fns';

type QueryRow = {
  period: string;
  count: number;
  duration: string;
};

export async function getSessionMetricsInTime(
  slug: string,
  filter: ServerFilterData
): Promise<ChartData> {
  const domain = getDomain(slug);
  const {
    duration,
    today,
    thisYear,
    granularity,
    interval,
    currentRange,
    startDateString,
    endDateString,
    key,
  } = inTime(filter.dateInterval);
  const categories: { [key: string]: ChartDataCategory } = {
    sessions: {
      name: 'Total sessions',
      unit: 'number',
    },
    duration: {
      name: 'Ø Reading duration',
      unit: 'seconds',
    },
  };
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      date_series as (
        select
          date_trunc($1, dd) as period
        from generate_series($2::timestamp, $3::timestamp, $4::interval) dd 
      ),
      events_with_time_difference_between_user_events as (
        select distinct
          client_id,
          time,
          time - lag(time, 1) over (order by time) as diff
        from events
        where
          domain=$5 and 
          time::date <@ $6::daterange
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
      sessions_with_duration_and_period as (
        select
          client_id,
          min(time) as start_time,
          max(time) as end_time,
          max(time) - min(time) as duration,
          date_trunc($1, time) as period 
        from events_with_session_number
        group by client_id, period, session_no
      ),
      sessions_by_period as (
        select
          period,
          count(*) as count,
          avg(duration) as duration
        from sessions_with_duration_and_period
        group by period 
      ),
      result as (
        select
          date_series.period as period,
          cast(coalesce(sessions_by_period.count, 0) as integer) as count,
          coalesce(sessions_by_period.duration, 'PT0S') as duration
        from date_series
        left join sessions_by_period on sessions_by_period.period = date_series.period
        order by date_series.period
      )
    select * from result
  `,
    [
      granularity,
      startDateString,
      endDateString,
      interval,
      domain,
      currentRange,
    ]
  );
  const points = rows.map((item) => {
    return {
      [key]: granularDateTime(item.period, duration, today, thisYear),
      [categories.sessions.name]: item.count,
      [categories.duration.name]: fnsDuration.toSeconds(item.duration),
    };
  });
  return {
    points,
    key,
    categories: [categories.duration, categories.sessions],
  };
}
