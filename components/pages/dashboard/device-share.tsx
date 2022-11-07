import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';
import BarListCard from 'components/blocks/bar-list-card';
import useDeviceTraffic from 'lib/dashboard/hooks/use-device-traffic';

export default function DeviceShare() {
  const { book, filterData } = useDashboardData();
  const { data } = useDeviceTraffic(book.slug, filterData);
  return (
    <BarListCard
      data={data}
      title="Devices"
      nameTitle="Type"
      valueTitle="Share"
      percentage={true}
    />
  );
}
