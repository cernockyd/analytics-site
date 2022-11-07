import useApi from 'lib/use-api';
import { FilterData } from 'lib/dashboard/hooks/use-dashboard-data';
import { urlInterval } from '../../hooks/utils';
import { DeviceTraffic } from 'lib/dashboard/api/device-traffic';

export default function useDeviceTraffic(bookSlug: string, filter: FilterData) {
  const { start, end } = urlInterval(filter.dateInterval);
  return useApi<DeviceTraffic>(
    `/api/book/${bookSlug}/device-traffic?dateStart=${start}&dateEnd=${end}`
  );
}
