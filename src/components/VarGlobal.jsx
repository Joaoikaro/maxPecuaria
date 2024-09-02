import { useState } from 'react';

export const globalState = {
  value: '',
  setValue: () => {}
};

export function useGlobalState() {
  const [value, setValue] = useState('');

  globalState.value = value;
  globalState.setValue = setValue;
  return [value, setValue];
}
