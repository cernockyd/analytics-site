import { DateInterval } from 'lib/dashboard/hooks/use-dashboard-data';
import { urlInterval } from '../hooks/utils';
import { BooksReadersItem } from 'lib/api/books-readers-list';
import useApiInfinite from 'lib/use-api-infinite';

export default function useBooksReadersList(dateInterval: DateInterval) {
  const { start, end } = urlInterval(dateInterval);
  return useApiInfinite<BooksReadersItem>(
    `/api/books?type=readers&dateStart=${start}&dateEnd=${end}`,
    10
  );
}
