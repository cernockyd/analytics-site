import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { delta, deltaType, KPIData, rangesForComparison } from 'lib/utils';

export type QueryRow = {
  count: number;
  category: string;
};

export async function getPageViews(
  slug: string,
  filter: ServerFilterData
): Promise<KPIData> {
  const domain = getDomain(slug);
  const { currentRange, compareRange, totalRange } = rangesForComparison(
    filter.dateInterval
  );
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with pageview_categories as (
      select
        case
        when time::date <@ $1::daterange then 'current'
        when time::date <@ $2::daterange then 'compare'
        end as category
      from events
      where 
        domain=$3 and 
        name='pageview' and
        time::date <@ $4::daterange
      )
    select
      count(*),
      category
    from pageview_categories
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
