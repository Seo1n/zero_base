import { useCallback, useState } from 'react';

export const useInput = (initialValue = null) => {
  const [value, setter] = useState(initialValue);

  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler, setter];
};
