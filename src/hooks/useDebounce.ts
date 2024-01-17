import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, timeout: number): T => {
  const [state, setState] = useState(value);

    const handler = setTimeout(() => setState(value), timeout);

    return () => clearTimeout(handler);
  };

  useEffect(effect, [value]);

  return state;
};
