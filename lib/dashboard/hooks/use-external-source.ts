import useApi from 'lib/use-api';
import { FilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { urlInterval } from '../../hooks/utils';
import { ExternalSource } from 'lib/dashboard/api/external-source';

export default function useExternalSource(
  bookSlug: string,
  filter: FilterData
) {
  const { start, end } = urlInterval(filter.dateInterval);
  return useApi<ExternalSource>(
    `/api/book/${bookSlug}/external-source?dateStart=${start}&dateEnd=${end}`
  );
}
