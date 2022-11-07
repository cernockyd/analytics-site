import useApi from 'lib/use-api';
import { FilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { urlInterval } from '../../hooks/utils';
import { SessionsMetrics } from 'lib/dashboard/api/sessions-metrics';

export default function useSessionsMetrics(
  bookSlug: string,
  filter: FilterData
) {
  const { start, end } = urlInterval(filter.dateInterval);
  return useApi<SessionsMetrics>(
    `/api/book/${bookSlug}/sessions-metrics?dateStart=${start}&dateEnd=${end}`
  );
}
