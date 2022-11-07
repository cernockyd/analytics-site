import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { range } from 'lib/utils';

export type QueryRow = {
  traffic: number;
  referrer: string;
};

export type ExternalSource = {
  name: string;
  value: number;
}[];

export async function getExternalSource(
  slug: string,
  filter: ServerFilterData
): Promise<ExternalSource> {
  const domain = getDomain(slug);
  const currentRange = range(filter.dateInterval);
  const internalLike = `%${domain}%`;
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      pageview_events_with_category as (
        select
          distinct on (client_id)
          client_id,
          case 
            when referrer is null THEN 'not set'
            when referrer ilike $1 THEN 'internal'
          else referrer END as referrer,
          time
        from events
        where
          domain=$2
          and name='pageview'
          and time::date <@ $3::daterange
        order by client_id, time desc
      ), count_pathname_traffic as (
        select
          count(*) as traffic,
          referrer
        from pageview_events_with_category
        group by referrer
        order by traffic desc
      )
    select
      *
    from count_pathname_traffic
    where
      referrer!='internal'
  `,
    [internalLike, domain, currentRange]
  );
  const result = rows.map(({ referrer, traffic }) => {
    return {
      name: referrer,
      value: traffic,
    };
  });
  return result;
}
