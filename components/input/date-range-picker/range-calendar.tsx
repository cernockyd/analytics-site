import { useRef } from 'react';
import { useRangeCalendarState } from '@react-stately/calendar';
import { useRangeCalendar } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { createCalendar } from '@internationalized/date';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useCalendarGrid } from '@react-aria/calendar';
import { getWeeksInMonth } from '@internationalized/date';
import { useCalendarCell } from '@react-aria/calendar';
import { isSameDay, getDayOfWeek } from '@internationalized/date';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

export function CalendarButton(props) {
  const ref = useRef();
  const { buttonProps } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={`inline-flex focus:outline-none focus:ring-2 border-gray-300 pl-1 pr-1 pt-1 pb-1 text-sm font-medium rounded border shadow-sm ${
        props.isDisabled ? 'text-gray-400' : ''
      } ${!props.isDisabled ? 'hover:bg-gray-50' : ''} outline-none ${
        isFocusVisible ? 'ring-2 ring-offset-2 ring-blue-300' : ''
      }`}
    >
      {props.children}
    </button>
  );
}

export function CalendarCell({ state, date }) {
  const ref = useRef();
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref);

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected;
  const isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected;

  // We add rounded corners on the left for the first day of the month,
  // the first day of each week, and the start date of the selection.
  // We add rounded corners on the right for the last day of the month,
  // the last day of each week, and the end date of the selection.
  const { locale } = useLocale();
  const dayOfWeek = getDayOfWeek(date, locale);
  const isRoundedLeft =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td
      {...cellProps}
      className={`py-0.5 relative ${isFocusVisible ? 'z-10' : 'z-0'}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={`w-full flex items-center justify-center h-9 w-9 text-sm outline-none group ${
          isRoundedLeft ? 'rounded-l-md' : ''
        } ${isRoundedRight ? 'rounded-r-md' : ''} ${
          isSelected ? (isInvalid ? 'bg-red-200' : 'bg-gray-200') : ''
        } ${isDisabled ? 'disabled' : ''}`}
      >
        <div
          className={`w-full ${
            !isRoundedRight && !isRoundedLeft ? 'rounded' : ''
          } text-sm h-full ${isRoundedRight ? 'rounded-r-md' : ''} ${
            isRoundedLeft ? 'rounded-l-md' : ''
          }  flex items-center justify-center ${
            isDisabled && !isInvalid ? 'text-gray-400' : ''
          } ${
            // Focus ring, visible while the cell has keyboard focus.
            isFocusVisible
              ? 'ring-2 group-focus:z-2 ring-gray-500 ring-offset-2'
              : ''
          } ${
            // Darker selection background for the start and end.
            isSelectionStart || isSelectionEnd
              ? isInvalid
                ? 'bg-red-400 text-white hover:bg-red-500'
                : 'bg-blue-500  text-white hover:bg-blue-500'
              : ''
          } ${
            // Hover state for cells in the middle of the range.
            isSelected && !isDisabled && !(isSelectionStart || isSelectionEnd)
              ? isInvalid
                ? 'hover:bg-gray-300'
                : 'hover:bg-gray-300'
              : ''
          } ${
            // Hover state for non-selected cells.
            !isSelected && !isDisabled ? 'hover:bg-gray-200' : ''
          } cursor-default`}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  );
}

export function CalendarGrid({ state, ...props }) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-gray-600">
        <tr>
          {weekDays.map((day, index) => (
            <th
              className="text-center text-gray-400 text-xs font-medium"
              key={index}
            >
              {days[index]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RangeCalendar(props) {
  const { locale } = useLocale();
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef();
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} ref={ref} className="inline-block w-fill p-2">
      <div className="flex items-center pb-4">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon className="text-gray-700 h-5 w-5" />
        </CalendarButton>
        <h2 className="flex-1 font-bold text-center text-sm">{title}</h2>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon className="text-gray-700 h-5 w-5" />
        </CalendarButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}
