import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import getDomain from 'lib/domain';
import sql from 'lib/postgres';
import { granularDateTime, inTime, ChartData } from '../../utils';

type QueryRow = {
  period: string;
  pageviews: string;
};

export async function getPageviewsInTime(
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
  const category = 'Pageviews';
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      date_series as (
        select
          date_trunc($1, dd) as period
        from generate_series($2::timestamp, $3::timestamp, $4::interval) dd 
      ),
      pageviews_with_period as (
        select
          date_trunc($1, time) as period 
        from events
        where 
          domain=$5 and 
          name='pageview' and
          time::date <@ $6::daterange
      ),
      pageviews_by_period as (
        select
          count(*) as pageviews,
          period
        from pageviews_with_period
        group by period
      ),
    result as (
      select
      date_series.period as period,
      coalesce(pageviews_by_period.pageviews, 0) as pageviews
      from date_series
    left join pageviews_by_period on pageviews_by_period.period = date_series.period
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
    [category]: parseInt(item.pageviews),
  }));
  return {
    points,
    key,
    categories: [{ name: category, unit: 'number' }],
  };
}
