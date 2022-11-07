import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { delta, deltaType, KPIData, rangesForComparison } from 'lib/utils';

export type QueryRow = {
  bounce_rate: number | null;
  category: string;
};

export async function getBounceRate(
  slug: string,
  filter: ServerFilterData
): Promise<KPIData> {
  const domain = getDomain(slug);
  const { currentRange, compareRange, totalRange } = rangesForComparison(
    filter.dateInterval
  );
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with event_categories as (
      select
        client_id,
        case
        when time::date <@ $1::daterange then 'current'
        when time::date <@ $2::daterange then 'compare'
        end as category
      from events
      where 
        domain=$3 and
        time::date <@ $4::daterange
      ),
    client_events_count_by_category as (
      select
        category,
        client_id,
        count(*) as event_count
      from event_categories
      group by category, client_id
    ),
    total_and_no_activity_by_category as (
      select
        category,
        count(distinct client_id) as total,
        count(*) filter (where event_count=1) as no_activity
      from client_events_count_by_category
      group by category
    )
    select
      category,
      no_activity/nullif(total, 0)::float as bounce_rate
    from total_and_no_activity_by_category
  `,
    [currentRange, compareRange, domain, totalRange]
  );
  const original = { current: 0, compare: 0 };
  const data = rows.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.category]: item.bounce_rate ? item.bounce_rate : 0,
      }),
    original
  );
  const change = delta(data.current, data.compare);
  const result: KPIData = {
    metric: data.current,
    metricPrev: data.compare,
    delta: change,
    deltaType: deltaType(change),
    type: 'percent',
  };
  return result;
}
