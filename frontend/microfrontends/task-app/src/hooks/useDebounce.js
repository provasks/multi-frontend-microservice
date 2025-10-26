import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    console.log('useDebounce: value changed, setting timeout', { value, delay });
    const handler = setTimeout(() => {
      console.log('useDebounce: timeout fired, updating debounced value', { value, debouncedValue });
      setDebouncedValue(value);
    }, delay);

    return () => {
      console.log('useDebounce: clearing timeout');
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debounced callback functions
 * @param {function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {array} deps - Dependencies array
 * @returns {function} - Debounced callback
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const [debouncedCallback, setDebouncedCallback] = useState(() => callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...deps]);

  return debouncedCallback;
};
