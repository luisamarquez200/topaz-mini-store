import { useEffect, useState } from 'react';

export const DEFAULT_DEBOUNCE_DELAY_MS = 250;

export const useDebouncedValue = <T>(
  value: T,
  delayMs: number = DEFAULT_DEBOUNCE_DELAY_MS
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
};
