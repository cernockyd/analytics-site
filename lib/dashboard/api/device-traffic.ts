import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { range } from 'lib/utils';

export type QueryRow = {
  visitors: number;
  percent: number;
  screen_size: string;
};

export type DeviceTraffic = {
  name: string;
  value: number;
}[];

export async function getDeviceTraffic(
  slug: string,
  filter: ServerFilterData
): Promise<DeviceTraffic> {
  const domain = getDomain(slug);
  const currentRange = range(filter.dateInterval);
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      pageview_events_with_category as (
        select distinct
          client_id,
          screen_size
        from events
        where
          domain=$1
          and name='pageview'
          and time::date <@ $2::daterange
      ), count_pathname_share as (
        select
          count(*) as visitors,
          round(count(*) / sum(count(*)) OVER () * 100, 1) percent,
          screen_size
        from pageview_events_with_category
        group by screen_size
        order by percent desc
      )
    select
      *
    from count_pathname_share
  `,
    [domain, currentRange]
  );
  let remaining = 100;
  for (let i = 0; i < rows.length - 1; i++) {
    remaining -= rows[i].percent;
  }
  rows[rows.length - 1].percent = remaining;
  const result = rows.map(({ screen_size, percent }) => {
    return {
      name: screen_size,
      value: percent / 100,
    };
  });
  return result;
}
