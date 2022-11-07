import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import getDomain from 'lib/domain';
import sql from 'lib/postgres';
import { granularDateTime, inTime, ChartData } from '../../utils';

type QueryRow = {
  period: string;
  readers: string;
};

export async function getReadersInTime(
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
  const category = 'Readers';

  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      date_series as (
        select
          date_trunc($1, dd) as period
        from generate_series($2::timestamp, $3::timestamp, $4::interval) dd 
      ),
      clients_with_period as (
        select
          client_id,
          date_trunc($1, time) as period 
        from events
        where 
          domain=$5 and 
          time::date <@ $6::daterange
      ),
    readers_by_period as (
      select
        count(distinct client_id) as readers,
        period
      from clients_with_period
      group by period
    ),
    result as (
      select
      date_series.period as period,
      coalesce(readers_by_period.readers, 0) as readers
      from date_series
    left join readers_by_period on readers_by_period.period = date_series.period
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
    [category]: parseInt(item.readers),
  }));
  return {
    points,
    key,
    categories: [{ name: category, unit: 'number' }],
  };
}
