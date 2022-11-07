import useApi from 'lib/use-api';
import { FilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { KPIData, KPIType } from 'lib/utils';
import { urlInterval } from '../../hooks/utils';

export default function useKPI(
  bookSlug: string,
  type: KPIType,
  filter: FilterData
) {
  const { start, end } = urlInterval(filter.dateInterval);
  return useApi<KPIData>(
    `/api/book/${bookSlug}/kpi/${type}?dateStart=${start}&dateEnd=${end}`
  );
}
