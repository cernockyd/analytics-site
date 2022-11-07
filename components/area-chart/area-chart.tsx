import React from 'react';
import {
  AreaChart as Chart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ChartTooltip from './chart-tooltip';

interface AreaChartProps {
  data: any;
  dataKey: string;
  category: string;
  startEndOnly?: boolean;
  showTooltip?: boolean;
  valueFormatter: (value: number) => string;
  className: string;
}

export default function AreaChart({
  data,
  dataKey,
  category,
  startEndOnly = false,
  showTooltip = true,
  valueFormatter,
  className,
}: AreaChartProps) {
  const color = '#3b82f6';
  const id = 'blue';
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer>
        <Chart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey={dataKey}
            tick={{ transform: 'translate(0, 6)' }}
            ticks={
              startEndOnly
                ? [data[0][dataKey], data[data.length - 1][dataKey]]
                : undefined
            }
            style={{
              fontSize: '12px',
              fontFamily: 'Inter; Helvetica',
            }}
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={false}
            padding={{ left: 6, right: 6 }}
            minTickGap={6}
          />
          <YAxis domain={[0, 'auto']} hide={true} />
          {showTooltip ? (
            <Tooltip
              // ongoing issue: https://github.com/recharts/recharts/issues/2920
              wrapperStyle={{ outline: 'none' }}
              isAnimationActive={false}
              cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  valueFormatter={valueFormatter}
                  color={color}
                />
              )}
              position={{ y: 0 }}
            />
          ) : null}
          <defs key={category}>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            key={category}
            name={category}
            type="linear"
            dataKey={category}
            stroke={color}
            fill={`url(#${id})`}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
