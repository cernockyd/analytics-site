import { useState } from 'react';
import {
  DashboardDataContext,
  FilterData,
  UserData,
} from 'lib/dashboard/hooks/use-dashboard-data';
import Layout from 'components/layout';
import Header from './header';
import { Book } from 'lib/api/book';
import Performance from './performance';
import Other from './other';
import { today, getLocalTimeZone } from '@internationalized/date';
import { KPIType } from 'lib/utils';

type Props = {
  book: Book;
  defaultActiveKpi?: KPIType;
  defaultUserData?: UserData;
  defaultFilterData?: FilterData;
};

const localDate = today(getLocalTimeZone());

export default function Dashboard({
  book,
  defaultActiveKpi: defaultActiveMetric = 'readers',
  defaultUserData = { lastViewed: [] },
  defaultFilterData = {
    dateInterval: {
      start: localDate.subtract({ days: 7 }),
      end: localDate,
    },
  },
}: Props) {
  const [filterData, setFilterData] = useState<FilterData>(defaultFilterData);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [activeMetric, setActiveMetric] =
    useState<KPIType>(defaultActiveMetric);

  return (
    <DashboardDataContext.Provider
      value={{
        userData,
        setUserData,
        activeMetric,
        setActiveMetric,
        filterData,
        setFilterData,
        book,
      }}
    >
      <Layout title={`${book.title} - Analytics`}>
        <Header />
        <Performance />
        <Other />
      </Layout>
    </DashboardDataContext.Provider>
  );
}
