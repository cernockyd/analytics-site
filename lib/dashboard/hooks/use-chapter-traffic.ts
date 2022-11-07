import useApi from 'lib/use-api';
import { FilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { urlInterval } from '../../hooks/utils';
import { ChaptersTraffic } from 'lib/dashboard/api/chapter-traffic';
import { TrafficType } from 'lib/utils';

export default function useChapterTraffic(
  type: TrafficType,
  bookSlug: string,
  filter: FilterData
) {
  const { start, end } = urlInterval(filter.dateInterval);
  return useApi<ChaptersTraffic>(
    `/api/book/${bookSlug}/chapter-traffic?dateStart=${start}&dateEnd=${end}&type=${type}`
  );
}
