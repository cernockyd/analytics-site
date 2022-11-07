import {
  mergeProps,
  useFocusRing,
  useGridList,
  useGridListItem,
} from 'react-aria';
import { useListState } from 'react-stately';
import { useRef } from 'react';

export default function List<T extends object>(props) {
  const state = useListState<T>(props);
  const ref = useRef();
  const { gridProps } = useGridList<T>(props, state, ref);

  return (
    <ul {...gridProps} ref={ref} className="list">
      {[...state.collection].map((item) => (
        <ListItem key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

function ListItem({ item, state }) {
  const ref = useRef();
  const { rowProps, gridCellProps, isPressed } = useGridListItem(
    { node: item },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
      className={`${isPressed ? 'pressed' : ''} ${
        isFocusVisible ? 'focus-visible' : ''
      }`}
    >
      <div {...gridCellProps}>{item.rendered}</div>
    </li>
  );
}
