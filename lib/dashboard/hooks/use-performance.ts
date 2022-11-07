import { ChartData } from 'lib/utils';
import useApi from 'lib/use-api';
import { FilterData } from './use-dashboard-data';

export default function usePerformance(
  slug: string,
  type: string,
  filter: FilterData
) {
  const start = filter.dateInterval.start.toString();
  const end = filter.dateInterval.end.toString();
  return useApi<ChartData>(
    `/api/book/${slug}/performance?type=${type}&dateStart=${start}&dateEnd=${end}`
  );
}
