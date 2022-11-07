/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import type { AriaListBoxOptions } from '@react-aria/listbox';
import type { ListState } from 'react-stately';
import type { Node } from '@react-types/shared';
import { useListBox, useOption } from 'react-aria';
import { CheckIcon } from '@heroicons/react/20/solid';

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

export function ListBox(props: ListBoxProps) {
  const ref = React.useRef<HTMLUListElement>(null);
  const { listBoxRef = ref, state } = props;
  const { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="max-h-100 overflow-hidden w-52 rounded-md outline-none"
    >
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

function Option({ item, state }: OptionProps) {
  const ref = React.useRef<HTMLLIElement>(null);
  const { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key,
    },
    state,
    ref
  );

  let text = 'text-gray-700';
  if (isFocused || isSelected) {
    text = 'text-gray-700';
  } else if (isDisabled) {
    text = 'text-gray-200';
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      className={`pl-4 pr-4 pb-2.5 pt-2.5 text-sm outline-none cursor-default border-gray-200 flex items-center justify-between ${text} ${
        isFocused ? 'bg-gray-50' : ''
      } ${isSelected ? 'font-bold' : ''}`}
    >
      {item?.textValue ? item.textValue : item.rendered}
      {isSelected && (
        <CheckIcon aria-hidden="true" className="w-4 h-4 text-gray-700" />
      )}
    </li>
  );
}
