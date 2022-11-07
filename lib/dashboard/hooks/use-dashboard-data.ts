import React, { createContext, useContext } from 'react';
import { Book } from 'lib/api/book';
import { KPIType } from 'lib/utils';
import { DateValue } from '@internationalized/date';

export type DateInterval = {
  start: DateValue;
  end: DateValue;
};

export type ServerDateInterval = {
  start: Date;
  end: Date;
};

export type ServerFilterData = {
  dateInterval?: ServerDateInterval;
};

export type FilterData = {
  dateInterval?: DateInterval;
};

export type UserData = {
  lastViewed?: Book[];
};

type DashboardDataContextType = {
  book: Book;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  activeMetric: KPIType;
  setActiveMetric: React.Dispatch<React.SetStateAction<KPIType>>;
  filterData: FilterData;
  setFilterData: React.Dispatch<React.SetStateAction<FilterData>>;
};

export const DashboardDataContext =
  createContext<DashboardDataContextType | null>(null);

export default function useDashboardData() {
  const result = useContext(DashboardDataContext);
  if (!result) {
    throw new Error();
  }
  return result;
}
