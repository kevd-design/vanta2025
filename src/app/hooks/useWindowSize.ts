'use client'

import { useState, useEffect, useCallback } from 'react';
import { DIMENSIONS } from '@/app/constants';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { WindowSize } from '@/app/lib/types/layout';

export const useWindowSize = () => {
  // Initialize with undefined to prevent hydration mismatch
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : DIMENSIONS.screen.defaultWidth,
    height: typeof window !== 'undefined' ? window.innerHeight : DIMENSIONS.screen.defaultHeight
  });
  
  const [hasMounted, setHasMounted] = useState(false);

  const handleResize = useCallback(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const newWidth = Math.round(window.innerWidth);
    const newHeight = Math.round(window.innerHeight);
    
    setWindowSize(prev => {
      if (prev.width === newWidth && prev.height === newHeight) {
        return prev;
      }
      return { width: newWidth, height: newHeight };
    });
  }, []);

  const debouncedResize = useDebounce(handleResize, 150);

  // Set hasMounted flag
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle resize events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get initial size after component mounts to avoid SSR mismatch
    handleResize();
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      debouncedResize.cancel();
      window.removeEventListener('resize', debouncedResize);
    };
  }, [handleResize, debouncedResize]);

  // Return default dimensions until client-side code runs
  return hasMounted ? windowSize : {
    width: DIMENSIONS.screen.defaultWidth,
    height: DIMENSIONS.screen.defaultHeight
  };
};