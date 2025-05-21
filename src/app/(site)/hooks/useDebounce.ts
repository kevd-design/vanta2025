'use client'

import { useMemo, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

export const useDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 100
) => {
  // Keep the callback in a ref to prevent unnecessary recreations
  const callbackRef = useRef(callback);
  
  // Update the callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create stable debounced function
  const debouncedCallback = useMemo(
    () => debounce(
      (...args: Parameters<T>) => {
        callbackRef.current(...args);
      },
      delay
    ),
    [delay] // Only recreate if delay changes
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};