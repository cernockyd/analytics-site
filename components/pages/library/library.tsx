import { useState } from 'react';
import { BookListDataContext } from 'lib/dashboard/hooks/use-book-list-data';
import Layout from 'components/layout';
import {
  today,
  getLocalTimeZone,
  startOfYear,
  endOfYear,
} from '@internationalized/date';
import { DateInterval } from 'lib/dashboard/hooks/use-dashboard-data';
import Hero from './hero';
import BookReadersList from './book-readers-list';

type Props = {
  defaultDateInterval?: DateInterval;
};

const localDate = today(getLocalTimeZone());

export default function Home({
  defaultDateInterval = {
    start: startOfYear(localDate),
    end: endOfYear(localDate),
  },
}: Props) {
  const [dateInterval, setDateInterval] =
    useState<DateInterval>(defaultDateInterval);
  return (
    <BookListDataContext.Provider
      value={{
        dateInterval,
        setDateInterval,
      }}
    >
      <Layout title="Next-book Analytics Library">
        <Hero />
        <BookReadersList />
      </Layout>
    </BookListDataContext.Provider>
  );
}
