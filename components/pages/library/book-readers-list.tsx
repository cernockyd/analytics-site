import useBooksReadersList from 'lib/hooks/use-books-readers-list';
import useBookListData from 'lib/dashboard/hooks/use-book-list-data';
import List from './list';
import { Item } from 'react-stately';
import { BooksReadersItem, BooksReadersList } from 'lib/api/books-readers-list';
import Button from './button';
import BookIcon from './book-icon';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Card from 'components/blocks/card';
import { ChartBarIcon } from '@heroicons/react/20/solid';

export default function BookReadersList() {
  const { dateInterval } = useBookListData();
  const { data, size, setSize, isLoadingMore, isEmpty, isReachingEnd } =
    useBooksReadersList(dateInterval);

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {isEmpty ? <p>Yay, no books found.</p> : null}
      <List<BooksReadersList> items={data}>
        {(item: BooksReadersItem) => {
          const bookUrl = 'https://' + item.domain;
          return (
            <Item key={item.slug}>
              <Card className="rounded mb-3 grid grid-cols-2 gap-4 p-4 border-0 outline-0 ring-0 shadow-lg">
                <div className="flex">
                  <BookIcon
                    src={bookUrl + '/assets/favicon.ico'}
                    alt={item.slug}
                    size={48}
                  />
                  <div className="flex flex-col ml-3">
                    <Link
                      className="text-sm text-gray-700 hover:underline font-semibold mb-1"
                      href={'/book/' + item.slug}
                    >
                      {item.slug}
                    </Link>
                    <Link
                      className="text-sm hover:underline group text-gray-400 flex"
                      href={bookUrl}
                    >
                      {item.domain}{' '}
                      <ArrowTopRightOnSquareIcon className="invisible group-hover:visible w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-400 mb-1">Readers</p>
                    <p className="text-sm">{item.readers}</p>
                  </div>
                  <Link
                    className="text-sm hover:underline group text-gray-400 flex items-center mr-3"
                    href={'/book/' + item.slug}
                  >
                    <div className="rounded-full border-2 p-1">
                      <ChartBarIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                </div>
              </Card>
            </Item>
          );
        }}
      </List>
      <div className="items-centers flex mt-4 justify-center">
        <Button
          isDisabled={isLoadingMore || isReachingEnd}
          onPress={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? 'Loading...'
            : isReachingEnd
            ? 'No more book'
            : 'Load more'}
        </Button>
      </div>
    </div>
  );
}
