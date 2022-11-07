import React, { createContext, useContext } from 'react';
import { DateInterval } from './use-dashboard-data';

type BookListDataContextType = {
  dateInterval: DateInterval;
  setDateInterval: React.Dispatch<React.SetStateAction<DateInterval>>;
};

export const BookListDataContext =
  createContext<BookListDataContextType | null>(null);

export default function useBookListData() {
  const result = useContext(BookListDataContext);
  if (!result) {
    throw new Error();
  }
  return result;
}
