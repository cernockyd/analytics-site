import Placeholder from 'components/placeholder';
import { DeltaType, KPIData, KPIDataDuration, KPIType } from 'lib/utils';
import Delta from './delta';
import { ReactNode } from 'react';
import { percentageFormatter, shortDuration } from 'lib/formatters';

type Props = {
  metric: KPIType;
  title: ReactNode;
  active: boolean;
  data: KPIData | KPIDataDuration;
  isLoading: boolean;
  isError: any;
};

const colors = {
  [DeltaType.Increase]: {
    text: 'text-emerald-500',
    background: 'bg-emerald-500',
    textLight: 'text-emerald-50',
  },
  [DeltaType.ModerateIncrease]: {
    text: 'text-emerald-500',
    background: 'bg-emerald-500',
    textLight: 'text-emerald-50',
  },
  [DeltaType.Decrease]: {
    text: 'text-rose-500',
    background: 'bg-rose-500',
    textLight: 'text-rose-50',
  },
  [DeltaType.ModerateDecrease]: {
    text: 'text-rose-500',
    background: 'bg-rose-500',
    textLight: 'text-rose-50',
  },
  [DeltaType.Unchanged]: {
    text: 'text-orange-500',
    background: 'bg-orange-500',
    textLight: 'text-orange-50',
  },
};

export default function Metric({
  title,
  data,
  isLoading,
  active = false,
  isError,
}: Props) {
  const error = !isError ? false : true;
  const color = data?.deltaType
    ? colors[data?.deltaType]
    : { background: 'bg-white', text: 'text-black', textLight: 'text-gray' };
  return (
    <div
      style={{ zIndex: 2 }}
      className={`w-full px-6 grow h-full py-6 group block ${
        active
          ? `border-blue-600 ${
              data ? color.background : 'bg-gray-500 text-white'
            }`
          : 'hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-gray-600'
      }`}
    >
      <p
        className={`text-xs whitespace-nowrap sm:text-sm shrink-0 mb-2 text-left ${
          active && data ? color.textLight : 'text-inherit'
        } font-normal`}
      >
        {isLoading || error ? (
          <Placeholder width="w-16" error={error} />
        ) : (
          title
        )}
      </p>
      <div className="flex md:flex-col lg:flex-row justify-between items-end md:space-x-1">
        <p
          className={`shrink-0 mr-1 text-base md:text-md lg:text-3xl ${
            active ? `text-white` : data ? color.text : 'text-gray-700'
          } md:font-semibold`}
        >
          {isLoading || error ? (
            <Placeholder width="w-10" error={error} />
          ) : (
            <span>
              {(() => {
                if (!data.metric && data.metric !== 0) return '-';
                if (data.type == 'duration') return shortDuration(data.metric);
                if (data.type == 'percent')
                  return percentageFormatter(data.metric);
                return data.metric;
              })()}{' '}
              {data?.unit && data?.unit}
            </span>
          )}
        </p>
        <span
          className={`${
            active && data
              ? color.textLight
              : data
              ? color.text
              : 'text-gray-700'
          }`}
        >
          {isLoading || error ? (
            <Placeholder width="w-14" height="26px" error={error} />
          ) : (
            <Delta
              type={data.deltaType}
              text={percentageFormatter(data.delta)}
            />
          )}
        </span>
      </div>
    </div>
  );
}
