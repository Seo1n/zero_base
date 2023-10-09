import { type SetStateAction, useCallback, useState } from 'react';

const useInput = (initialValue = null) => {
  const [value, setter] = useState(initialValue);

  const handler = useCallback((e: { target: { value: SetStateAction<null>; }; }) => {
    setter(e.target.value);
  }, []);
  return [value, handler, setter];
};

export default useInput;