import { Fragment } from 'react';
import { percentageFormatter } from 'lib/formatters';
import Bold from 'components/text/bold';

export interface Data {
  name: string;
  value: number;
}

export interface Props {
  nameTitle: string;
  valueTitle: string;
  data: Data[];
  percentage?: boolean;
}

const getWidthsFromValues = (data: Data[]) => {
  let maxValue = -Infinity;
  data.forEach((item) => {
    maxValue = Math.max(maxValue, item.value);
  });

  return data.map((item) => {
    if (item.value === 0) return 0;
    return Math.max((item.value / maxValue) * 100, 1);
  });
};

const defaultValueFormatter = (number: number) => number.toString();

export interface ListProps {
  data: Data[];
  valueFormatter: (number: number) => string;
}

const List = ({
  data = [],
  valueFormatter = defaultValueFormatter,
}: ListProps) => {
  const widths = getWidthsFromValues(data);

  const rowHeight = 'h-9';

  return (
    <div className={'flex justify-between space-x-6'}>
      <div className="relative w-full">
        {data.map((item, idx) => (
          <div
            key={item.name}
            className={`flex items-center bg-blue-100 rounded ${rowHeight} after:content-[''] after:block after:absolute after:inset-x-0 after:bg-amber-50 after:-z-10 after:${rowHeight} ${
              idx === data.length - 1 ? 'nb-0' : 'mb-2'
            }`}
            style={{
              width: `${widths[idx]}%`,
              transition: 'all 2s',
            }}
          >
            <p
              className={`absolute max-w-full whitespace-nowrap truncate text-gray-700 left-2 text-sm`}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
      <div className="text-right min-w-min">
        {data.map((item, idx) => (
          <div
            key={item.name}
            className={`flex justify-end items-center h-9 ${
              idx === data.length - 1 ? 'mb-0' : 'mb-2'
            }`}
          >
            <p className={'whitespace-nowrap truncate text-gray-700 text-sm'}>
              {valueFormatter(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BarList({
  data,
  nameTitle,
  valueTitle,
  percentage,
}: Props) {
  return (
    <Fragment>
      <div className="flex justify-between mt-4 mb-2">
        <p>
          <Bold>{nameTitle}</Bold>
        </p>
        <p>
          <Bold>{valueTitle}</Bold>
        </p>
      </div>
      <List
        data={data}
        valueFormatter={percentage ? percentageFormatter : undefined}
      />
    </Fragment>
  );
}
