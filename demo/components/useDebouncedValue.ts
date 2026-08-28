import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has stopped changing for `delay` milliseconds.
 * @param value - the value to debounce
 * @param delay - quiet period in milliseconds
 * @returns the settled value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSettled(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return settled;
}
