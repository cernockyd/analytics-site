import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { delta, deltaType, KPIData, rangesForComparison } from 'lib/utils';

export const thresholdAmountRead = 90;

export type QueryRow = {
  finished: string;
  category: string;
};

export async function getReadToEnd(
  slug: string,
  filter: ServerFilterData
): Promise<KPIData> {
  const domain = getDomain(slug);
  const { currentRange, compareRange, totalRange } = rangesForComparison(
    filter.dateInterval
  );
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      events_of_book_finished as (
        select
          client_id,
          cast(coalesce(value, '0') AS integer) as value,
          case
            when time::date <@ $1::daterange then 'current'
            when time::date <@ $2::daterange then 'compare'
          end category
        from events
        where
          domain=$3
          and name='amount-read'
          and cast(coalesce(value, '0') as integer) >= $4
          and time::date <@ $5::daterange
      ), book_finished_count_by_category as (
        select
          count(*) as finished,
          category
        from events_of_book_finished
        group by category
      )
    select
      *
    from book_finished_count_by_category 
  `,
    [currentRange, compareRange, domain, thresholdAmountRead, totalRange]
  );

  type ReduceResult = {
    current?: number;
    compare?: number;
  };
  const defaultData = {
    current: 0,
    compare: 0,
  };
  const data = rows.reduce<ReduceResult>((accumulator, current) => {
    return {
      ...accumulator,
      [current.category]: current.finished ? current.finished : 0,
    };
  }, defaultData);
  const change = delta(data.current, data.compare);
  const result: KPIData = {
    metric: data.current,
    metricPrev: data.compare,
    delta: change,
    deltaType: deltaType(change),
    type: 'number',
  };
  return result;
}
