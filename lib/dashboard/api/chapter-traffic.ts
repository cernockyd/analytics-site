import sql from 'lib/postgres';
import getDomain from 'lib/domain';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { range, TrafficType } from 'lib/utils';

export type QueryRow = {
  traffic: number;
  pathname: string;
};

export type ChaptersTraffic = {
  [key: string]: number;
};

export async function getChapterTraffic(
  type: TrafficType,
  slug: string,
  filter: ServerFilterData
): Promise<ChaptersTraffic> {
  const domain = getDomain(slug);
  const currentRange = range(filter.dateInterval);
  const startingSlug = '/' + slug;
  const index = startingSlug + '/';
  const indexFile = index + 'index.html';
  const rows = await sql.unsafe<QueryRow[]>(
    `
    with
      pageview_events_with_category as (
        select
          client_id,
          case 
            when pathname=$1 THEN '/'
            when pathname=$2 THEN '/'
          else pathname END as pathname,
          time
        from events
        where
          domain=$3
          and name='pageview'
          and time::date <@ $4::daterange
      ), count_pathname_traffic as (
        select
          count(${
            type === TrafficType.Visitor ? 'distinct client_id' : '*'
          }) as traffic,
          pathname
        from pageview_events_with_category
        group by pathname
        order by traffic desc
      )
    select
      *
    from count_pathname_traffic
  `,
    [index, indexFile, domain, currentRange]
  );

  const defaultData: ChaptersTraffic = {};
  const result = rows.reduce<ChaptersTraffic>(
    (accumulator, { pathname, traffic }) => {
      const path = pathname.startsWith(startingSlug)
        ? pathname?.slice(startingSlug.length)
        : pathname;
      return {
        ...accumulator,
        [path]: traffic,
      };
    },
    defaultData
  );

  return result;
}
