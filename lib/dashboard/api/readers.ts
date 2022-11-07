import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { delta, deltaType, KPIData, rangesForComparison } from 'lib/utils';

export type QueryRow = {
  count: number;
  category: string;
};

export async function getReaders(
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
      clients_with_category as (
        select 
          client_id,
          case
            when time::date <@ $1::daterange then 'current'
            when time::date <@ $2::daterange then 'compare'
          end category
        from events
        where 
          domain=$3 and 
          time::date <@ $4::daterange
    )
    select
      count(distinct client_id),
      category
    from clients_with_category
    group by category 
  `,
    [currentRange, compareRange, domain, totalRange]
  );
  const original = { current: 0, compare: 0 };
  const data = rows.reduce(
    (obj, item) => Object.assign(obj, { [item.category]: item.count }),
    original
  );
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
