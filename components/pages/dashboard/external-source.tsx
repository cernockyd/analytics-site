import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';
import BarListCard from 'components/blocks/bar-list-card';
import useExternalSource from 'lib/dashboard/hooks/use-external-source';

export default function ExternalSource() {
  const { book, filterData } = useDashboardData();
  const { data } = useExternalSource(book.slug, filterData);
  return (
    <BarListCard
      data={data}
      title="Sources"
      nameTitle="Type"
      valueTitle="Visitors"
    />
  );
}
