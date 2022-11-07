import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import getDomain from 'lib/domain';
import sql from 'lib/postgres';
import { granularDateTime, inTime, ChartData } from '../../utils';
import { thresholdAmountRead } from './read-to-end';

type QueryRow = {
  period: string;
  finished: number;
};

export async function getReadToEndInTime(
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
  const category = 'Read to end';

  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      date_series as (
        select
          date_trunc($1, dd) as period
        from generate_series($2::timestamp, $3::timestamp, $4::interval) dd 
      ),
      evets_of_book_finished_with_period as (
        select
          client_id,
          cast(coalesce(value, '0') AS integer) as value,
          date_trunc($1, time) as period 
        from events
        where 
          domain=$5 
          and name='amount-read'
          and cast(coalesce(value, '0') as integer) >= $7
          and time::date <@ $6::daterange
      ),
      book_finished_count_by_period as (
        select
          count(*) as finished,
          period 
        from evets_of_book_finished_with_period
        group by period 
      ),
      result as (
        select
          date_series.period as period,
          cast(coalesce(book_finished_count_by_period.finished, 0) as integer) as finished 
          from date_series
        left join book_finished_count_by_period on book_finished_count_by_period.period = date_series.period
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
      thresholdAmountRead,
    ]
  );
  const points = rows.map((item) => ({
    [key]: granularDateTime(item.period, duration, today, thisYear),
    [category]: item.finished,
  }));
  return {
    points,
    key,
    categories: [{ name: category, unit: 'number' }],
  };
}
