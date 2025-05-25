'use client'

import { useMemo, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import type { DebouncedFunction } from '../../types'

export const useDebounce = <Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  delay = 100
): DebouncedFunction<Args, Return> => {
  const callbackRef = useRef(callback)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = useMemo(
    () => debounce(
      (...args: Args) => {
        callbackRef.current(...args)
      },
      delay
    ),
    [delay]
  ) as DebouncedFunction<Args, Return>

  useEffect(() => {
    return () => {
      debouncedCallback.cancel()
    }
  }, [debouncedCallback])

  return debouncedCallback
}