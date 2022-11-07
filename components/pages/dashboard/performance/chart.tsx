import AreaChart from 'components/area-chart/area-chart';
import usePerformance from 'lib/dashboard/hooks/use-performance';
import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';
import { percentageFormatter, shortDuration } from 'lib/formatters';
import * as fnsDuration from 'duration-fns';

const dataFormatter = (number: number) => number.toString();

const titles: { [key: string]: string } = {
  readers: 'Readers',
  'sessions-duration': 'Ø Reading duration',
  'read-to-end': 'Read to end',
  pageviews: 'Pageviews',
  sessions: 'Total sessions',
  'bounce-rate': 'Bounce rate',
};

function Chart() {
  const { book, filterData, activeMetric } = useDashboardData();
  const apiMetric = ['sessions', 'sessions-duration'].includes(activeMetric)
    ? 'sessions-metrics'
    : activeMetric;
  const { data, isError } = usePerformance(book.slug, apiMetric, filterData);
  const category = data?.categories.find(
    (c) => c.name === titles[activeMetric]
  );
  return (
    <div className={`px-6 pt-6 pb-4 relative`}>
      <AreaChart
        data={data ? data.points : null}
        dataKey={data?.key}
        category={category ? category.name : undefined}
        valueFormatter={
          category && category.unit == 'percentage'
            ? percentageFormatter
            : category && category.unit == 'seconds'
            ? (duration) =>
                shortDuration(
                  fnsDuration.normalize({ seconds: Math.round(duration) })
                )
            : dataFormatter
        }
        className="h-80"
      />
      {isError && (
        <div className="absolute inset-0 flex items-center text-sm justify-center backdrop-blur-sm bg-white/30 z-100">
          {titles[activeMetric]} data did not load
        </div>
      )}
    </div>
  );
}

export default Chart;
