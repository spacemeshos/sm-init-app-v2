import { useEffect, useState } from 'react';

/**
 * A hook that debounces a value by delaying updates until after a specified delay.
 * This is useful for preventing rapid changes, such as during hover events.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 100ms)
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
