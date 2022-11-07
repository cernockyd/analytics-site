import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';
import useChapterTraffic from 'lib/dashboard/hooks/use-chapter-traffic';
import BarListCard from 'components/blocks/bar-list-card';
import { TrafficType } from 'lib/utils';

export default function ChaptersTraffic() {
  const { book, filterData } = useDashboardData();
  const { data } = useChapterTraffic(
    TrafficType.Visitor,
    book?.slug,
    filterData
  );
  type Names = { [key: string]: string };
  const defaultNames = { '/': 'Cover' };
  const names: Names = book.documents.reduce<Names>((accumulator, doc) => {
    return {
      ...accumulator,
      ['/' + doc.file]:
        doc.role == 'chapter'
          ? doc.title
          : doc.role.charAt(0).toUpperCase() + doc.role?.slice(1),
    };
  }, defaultNames);
  const documents = Array.isArray(book.readingOrder)
    ? book.readingOrder.slice()
    : [];
  documents.unshift(''); // cover page
  const bars = documents.map((doc) => {
    const path = '/' + doc;
    return {
      name: names[path] === book.title ? path : names[path],
      value: data && data[path] ? data[path] : 0,
    };
  });
  return (
    <BarListCard
      data={bars}
      title="Chapters readers"
      nameTitle="Chapter"
      valueTitle="Readers"
    />
  );
}
