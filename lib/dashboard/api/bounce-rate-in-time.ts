import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import getDomain from 'lib/domain';
import sql from 'lib/postgres';
import { granularDateTime, inTime, ChartData } from '../../utils';

type QueryRow = {
  period: string;
  bounce_rate: number | null;
};

export async function getBounceRateInTime(
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
  const category = 'Bounce rate';
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      date_series as (
        select
          date_trunc($1, dd) as period
        from generate_series($2::timestamp, $3::timestamp, $4::interval) dd 
      ),
      events_with_period as (
        select
          client_id,
          date_trunc($1, time) as period 
        from events
        where 
          domain=$5 and 
          time::date <@ $6::daterange
      ),
      client_events_count_by_period as (
        select
          period,
          client_id,
          count(*) as event_count
        from events_with_period
        group by period, client_id
      ),
      total_and_no_activity_by_period as (
        select
          period,
          count(distinct client_id) as total,
          count(*) filter (where event_count=1) as no_activity
        from client_events_count_by_period
        group by period 
      ),
      bounce_rate_by_period as (
        select
          period,
          no_activity/nullif(total, 0)::float as bounce_rate
        from total_and_no_activity_by_period
      ),
      result as (
        select
          date_series.period as period,
          bounce_rate_by_period.bounce_rate as bounce_rate
        from date_series
        left join bounce_rate_by_period on bounce_rate_by_period.period = date_series.period
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
  const points = rows.map((item) => ({
    [key]: granularDateTime(item.period, duration, today, thisYear),
    [category]: item.bounce_rate ? item.bounce_rate : 0,
  }));
  return {
    points,
    key,
    categories: [{ name: category, unit: 'percentage' }],
  };
}
