/**
 * This product includes software developed at
 * The Apache Software Foundation (http://www.apache.org/).
 * 
 * The Initial Developer of some parts of the framework, which are copied from, derived from, or
 * inspired by Adobe Flex (via Apache Flex), is Adobe Systems Incorporated (http://www.adobe.com/).
 * Copyright 2003 - 2012 Adobe Systems Incorporated. All Rights Reserved.
 * The Initial Developer of the examples/mxroyale/tourdeflexmodules, 
 * is Adobe Systems Incorporated (http://www.adobe.com/).
 * Copyright 2009 - 2013 Adobe Systems Incorporated. All Rights Reserved.

 * The ping sound effect (ping.mp3) in 
 * examples/mxroyale/tourdeflexmodules/src/mx/effects/assets
 * was created by CameronMusic. (http://www.freesound.org/people/cameronmusic/sounds/138420/)
 */

export const ChartTooltipFrame = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div
    className={'text-sm shadow-lg rounded-md bg-white border border-gray-200'}
  >
    {children}
  </div>
);

export interface ChartTooltipRowProps {
  value: string;
  name: string;
  color: string | null | undefined;
}

export const ChartTooltipRow = ({ value, name }: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className={
          'shrink-0 rounded-full border-2 border-white shadow-md bg-blue-500 border w-3 h-3'
        }
      />
      <p className="font-medium tabular-nums text-gray-700 text-right whitespace-nowrap">
        {value}
      </p>
    </div>
    <p className="text-right whitespace-nowrap text-gray-500 text-light">
      {name}
    </p>
  </div>
);

export interface ChartTooltipProps {
  active: boolean | undefined;
  payload: any;
  label: string;
  color: string;
  valueFormatter: (value: number) => string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  color,
  valueFormatter,
}: ChartTooltipProps) {
  if (active && payload) {
    return (
      <ChartTooltipFrame>
        <div className={`border-b pt-2 pb-2 pl-4 pr-4 border-gray-200`}>
          <p className={'font-semibold text-gray-700'}>{label}</p>
        </div>

        <div className={'pl-4 pr-4 pt-2 pb-2 tr-space-y-1'}>
          {payload.map(
            ({ value, name }: { value: number; name: string }, idx: number) => (
              <ChartTooltipRow
                key={`id-${idx}`}
                value={valueFormatter(value)}
                name={name}
                color={color}
              />
            )
          )}
        </div>
      </ChartTooltipFrame>
    );
  }
  return null;
}
