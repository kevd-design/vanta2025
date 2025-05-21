'use client'

import { useState, useEffect, useCallback } from 'react';
import { DIMENSIONS } from '../constants';
import { useDebounce } from './useDebounce';
import type { WindowSize } from '../../types/dimensions';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: DIMENSIONS.screen.defaultWidth,
    height: DIMENSIONS.screen.defaultHeight
  });

  const handleResize = useCallback(() => {
    setWindowSize({
      width: Math.round(window.innerWidth),
      height: Math.round(window.innerHeight)
    });
  }, []);

  const debouncedResize = useDebounce(handleResize, 150); // Match Navigation's timing

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    handleResize(); // Initial size
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      debouncedResize.cancel();
      window.removeEventListener('resize', debouncedResize);
    };
  }, [handleResize, debouncedResize]);

  return windowSize;
};