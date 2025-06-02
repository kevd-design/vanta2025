'use client'

import { useState, useEffect, useCallback } from 'react';
import { DIMENSIONS } from '@/app/constants';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { WindowSize } from '@/app/lib/types/layout';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: DIMENSIONS.screen.defaultWidth,
    height: DIMENSIONS.screen.defaultHeight
  });

const handleResize = useCallback(() => {
  const newWidth = Math.round(window.innerWidth);
  const newHeight = Math.round(window.innerHeight);
  
  // Only update if dimensions actually changed
  setWindowSize(prev => {
    if (prev.width === newWidth && prev.height === newHeight) {
      return prev;
    }
    return { width: newWidth, height: newHeight };
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