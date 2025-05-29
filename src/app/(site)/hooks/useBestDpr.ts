import { useState, useEffect } from 'react';

export const useBestDpr = () => {
  const [dpr, setDpr] = useState<number>(1);
  
  useEffect(() => {
    // Get the device pixel ratio, but cap it at 2 to prevent performance issues
    const deviceDpr = typeof window !== 'undefined' 
      ? Math.min(window.devicePixelRatio || 1, 2) 
      : 1;
    
    setDpr(deviceDpr);
  }, []);
  
  return dpr;
};