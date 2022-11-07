import Select, { Item } from 'components/input/select';
import {
  today,
  getLocalTimeZone,
  startOfYear,
  startOfMonth,
  endOfMonth,
} from '@internationalized/date';
import { useRef } from 'react';
import { Popover } from 'components/blocks/popover';
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from 'react-stately';
import { useDateRangePicker as useCustomRangePicker } from '@react-aria/datepicker';
import { RangeCalendar } from 'components/input/date-range-picker/range-calendar';
import { DateField } from 'components/input/date-range-picker/date-field';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { DateRange } from '@react-types/datepicker';

export default function DateRangePicker(props: DateRangePickerStateOptions) {
  const customPickerState = useDateRangePickerState(props);
  const ref = useRef();
  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    dialogProps,
    calendarProps,
  } = useCustomRangePicker(props, customPickerState, ref);

  const handleRelativeRangeSelection = (key: string | number) => {
    const localDate = today(getLocalTimeZone());
    let range: DateRange;
    switch (key) {
      case 't':
        range = {
          start: localDate,
          end: localDate,
        };
        break;
      case 'w':
        range = {
          start: localDate.subtract({ days: 7 }),
          end: localDate,
        };
        break;
      case 'dm':
        range = {
          start: localDate.subtract({ days: 30 }),
          end: localDate,
        };
        break;
      case 'lm':
        range = {
          start: startOfMonth(localDate.subtract({ months: 1 })),
          end: endOfMonth(localDate.subtract({ months: 1 })),
        };
        break;
      case 'mtd':
        range = {
          start: startOfMonth(localDate),
          end: localDate,
        };
        break;
      case 'ytd':
        range = {
          start: startOfYear(localDate),
          end: localDate,
        };
        break;
      case 'lmy':
        range = {
          start: startOfMonth(localDate.subtract({ months: 12 })),
          end: endOfMonth(localDate.subtract({ months: 1 })),
        };
        break;
      case 'custom-date-range':
        customPickerState.setOpen(true);
        return;
    }
    customPickerState.setDateRange(range);
  };

  return (
    <div className="relative">
      <Select
        aria-label="Select date range"
        defaultSelectedKey="w"
        onOpenChange={(open) => {
          if (open) {
            customPickerState.setOpen(false);
          }
        }}
        onSelectionChange={(key) => handleRelativeRangeSelection(key)}
      >
        <Item key="t">Today</Item>
        <Item key="w">Last 7 days</Item>
        <Item key="dm">Last 30 days</Item>
        <Item key="mtd">Month to date</Item>
        <Item key="lm">Last month</Item>
        <Item key="ytd">Year to date</Item>
        <Item key="lmy">Last 12 months</Item>
        <Item key="custom-date-range" textValue="Custom range">
          <div {...groupProps} ref={ref} className="flex group w-64">
            <div className="absolute inset-y-0 left-0 right-12 bg-white px-4 py-2 border-r border-gray-300 flex transition-colors group-focus-within:border-blue-200 group-focus-within:group-hover:border-blue-200">
              <DateField {...startFieldProps} />
              <span aria-hidden="true" className="px-2">
                –
              </span>
              <DateField {...endFieldProps} />
              {customPickerState.validationState === 'invalid' && (
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 absolute right-3" />
              )}
            </div>
          </div>
        </Item>
      </Select>
      {customPickerState.isOpen && (
        <Popover
          isOpen={customPickerState.isOpen}
          {...dialogProps}
          onClose={() => customPickerState.setOpen(false)}
        >
          <RangeCalendar {...calendarProps} />
        </Popover>
      )}
    </div>
  );
}
