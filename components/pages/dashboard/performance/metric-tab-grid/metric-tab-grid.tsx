import { Node } from '@react-types/shared';
import { useRef } from 'react';
import {
  AriaTabListProps,
  AriaTabProps,
  useTab,
  useTabList,
  useFocusRing,
  mergeProps,
} from 'react-aria';
import { useTabListState, TabListState } from 'react-stately';
import { KPIData, KPIDataDuration, KPIType } from 'lib/utils';
import { urlInterval } from 'lib/hooks/utils';
import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';
import useApi from 'lib/use-api';
import Metric from './metric';
import { SessionsMetrics } from 'lib/dashboard/api/sessions-metrics';

export default function TabGrid<T extends object>(props: AriaTabListProps<T>) {
  const state = useTabListState<T>(props);
  const ref = useRef();
  const { tabListProps } = useTabList(props, state, ref);
  return (
    <div className={`tabs ${props.orientation || ''}`}>
      <div
        className="flex flex-col md:flex-row relative md:text-left border-b border-b-gray-200"
        {...tabListProps}
        ref={ref}
      >
        {[...state.collection].map((item) => (
          <Tab key={item.key} item={item} state={state} />
        ))}
      </div>
    </div>
  );
}

interface TabProps<T extends object> extends AriaTabProps {
  state: TabListState<T>;
  item: Node<T>;
}

export function Tab<T extends object>({ item, state }: TabProps<T>) {
  const ref = useRef();
  const { tabProps } = useTab(item, state, ref);
  const { filterData, book } = useDashboardData();
  const { start, end } = urlInterval(filterData.dateInterval);
  let kpiKey = '';
  if (['sessions-duration', 'sessions'].includes(item.key as string))
    kpiKey = 'sessions-metrics';
  else kpiKey = 'kpi/' + item.key;
  const { data, isLoading, isError } = useApi<
    KPIData | KPIDataDuration | SessionsMetrics
  >(`/api/book/${book.slug}/${kpiKey}?dateStart=${start}&dateEnd=${end}`);
  let metricData;
  switch (item.key) {
    case 'sessions-duration':
      metricData = data && data['duration'] ? data['duration'] : data;
      break;
    case 'sessions':
      metricData = data && data['count'] ? data['count'] : data;
      break;
    default:
      metricData = data;
      break;
  }
  const { focusProps, isFocusVisible } = useFocusRing();
  const active = tabProps['aria-selected'];
  return (
    <div
      {...mergeProps(tabProps, focusProps)}
      className={`w-full first:rounded-tl-lg overflow-hidden last:rounded-tr-lg md:border-r border-r-gray-200 border-b-gray-200 last:border-r-transparent last:rounded-tr-md cursor-default outline-none shadow-sm ${
        isFocusVisible ? 'ring-2 ' : ''
      }`}
      ref={ref}
    >
      <Metric
        metric={item.key as KPIType}
        active={active && true}
        title={item.rendered}
        data={metricData}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
