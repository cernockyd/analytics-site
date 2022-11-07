import DateRangePicker from 'components/input/date-range-picker/date-range-picker';
import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';

function Header() {
  const { book, filterData, setFilterData } = useDashboardData();

  return (
    <div className="flex items-center justify-between space-x-4">
      <h1 className="inline shrink-0 text-gray-800 text-2xl font-medium">
        {book.title}
      </h1>
      <DateRangePicker
        defaultValue={filterData.dateInterval}
        onChange={(rangeValue) =>
          setFilterData({ ...filterData, dateInterval: rangeValue })
        }
      />
    </div>
  );
}

export default Header;
