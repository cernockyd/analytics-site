import * as React from 'react';
import type { AriaSelectProps } from '@react-types/select';
import { useSelectState } from 'react-stately';
import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing,
} from 'react-aria';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
export { Item } from 'react-stately';

import { ListBox } from './list-box';
import { Popover } from '../../blocks/popover';

export default function Select<T extends object>(props: AriaSelectProps<T>) {
  // Create state based on the incoming props
  const state = useSelectState(props);

  // Get props for child elements from useSelect
  const ref = React.useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div className="inline-flex flex-col relative w-52 min-w-fit">
      <div
        {...labelProps}
        className="block text-sm font-medium text-gray-700 text-left cursor-default"
      >
        {props.label}
      </div>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={`pl-4 pr-4 -ml-px pt-2 pb-2 rounded-r-md border hover:bg-gray-50 relative inline-flex flex-row items-center justify-between rounded-md overflow-hidden cursor-default shadow-sm outline-none ${
          isFocusVisible ? 'border-gray-500' : 'border-gray-300'
        } ${state.isOpen ? 'bg-gray-50' : 'bg-white'}`}
      >
        <span
          {...valueProps}
          className={`text-sm whitespace-nowrap truncate ${
            state.selectedItem ? 'text-gray-800 font-medium' : 'text-gray-500'
          }`}
        >
          {state.selectedItem
            ? state.selectedItem.rendered
            : 'Select an option'}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 ${
            isFocusVisible ? 'text-gray-500' : 'text-gray-500'
          }`}
        />
      </button>
      {state.isOpen && (
        <Popover isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}
