import { useSearchFieldState } from 'react-stately';
import { useSearchField } from 'react-aria';
import { useRef } from 'react';

export default function SearchField(props) {
  const { label } = props;
  const state = useSearchFieldState(props);
  const ref = useRef();
  const { labelProps, inputProps } = useSearchField(props, state, ref);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
      <label {...labelProps}>{label}</label>
      <input {...inputProps} ref={ref} />
    </div>
  );
}
