'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { DIMENSIONS } from '@/app/constants';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { WindowSize } from '@/app/lib/types/layout';

export const useWindowSize = () => {
  // Store initial height to prevent URL bar hiding issues
  const initialHeightRef = useRef<number | null>(null);
  
  // Initialize with undefined to prevent hydration mismatch
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : DIMENSIONS.screen.defaultWidth,
    height: typeof window !== 'undefined' ? window.innerHeight : DIMENSIONS.screen.defaultHeight
  });
  
  const [hasMounted, setHasMounted] = useState(false);
  
  // Initialize once on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && initialHeightRef.current === null) {
      initialHeightRef.current = window.innerHeight;
    }
  }, []);

  const handleResize = useCallback(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const newWidth = Math.round(window.innerWidth);
    
    // For height: on mobile, use the initial height to prevent jumps from URL bar
    // We'll determine if it's mobile by checking if orientation is available
    const isMobile = typeof window.orientation !== 'undefined' || 
      navigator.userAgent.indexOf("Mobile") !== -1;
    
    const newHeight = isMobile && initialHeightRef.current !== null
      ? initialHeightRef.current // Use initial height on mobile
      : Math.round(window.innerHeight); // Use actual height on desktop
    
    setWindowSize(prev => {
      // Always update width
      if (prev.width !== newWidth) {
        return { width: newWidth, height: newHeight };
      }
      
      // On mobile, don't update height for small changes that could be URL bar
      if (isMobile && Math.abs(prev.height - newHeight) < 150) {
        return prev;
      }
      
      // Otherwise update both
      if (prev.height !== newHeight) {
        return { width: newWidth, height: newHeight };
      }
      
      return prev;
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