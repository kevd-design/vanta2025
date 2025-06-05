import { useMemo } from 'react';
import { calculateMinimumOpacity } from '@/app/lib/utils/opacityCalculator';
import { colorUtils } from '@/app/lib/utils/colorUtils';
import type { OpacityDebugStep } from '@/app/lib/utils/opacityCalculator';

interface BackgroundOptions {
  foregroundColor: string;
  backgroundColor: string;
  baseBackgroundColor: string;
  backgroundOpacity: number | "auto";
  minContrastLevel: "AA" | "AAA";
  maxOpacity: number;
  needsBackground: boolean;
  showDebug?: boolean;
  accessibilityData?: {
    needsBackground?: boolean;
    wcagCompliant?: boolean;
  };
}

interface BackgroundResult {
  backgroundColor: string;
  opacity: number;
  targetContrast: number;
  debugSteps?: OpacityDebugStep[];
}

export function useBackgroundProcessor({
  foregroundColor,
  backgroundColor,
  baseBackgroundColor,
  backgroundOpacity,
  minContrastLevel,
  maxOpacity,
  showDebug = false,
  accessibilityData
}: BackgroundOptions): BackgroundResult {
  
  return useMemo(() => {
    // Define target contrast
    const targetContrast = minContrastLevel === 'AAA' ? 7.0 : 4.5;
    let finalOpacity = typeof backgroundOpacity === 'number' ? backgroundOpacity : 0.85;
    let debugSteps = undefined;
    
    if (backgroundOpacity === 'auto') {
      // Calculate minimum opacity for target contrast
      const opacityResult = calculateMinimumOpacity(
        foregroundColor,
        backgroundColor,
        baseBackgroundColor,
        targetContrast,
        showDebug
      );
      
      finalOpacity = opacityResult.opacity;
      debugSteps = opacityResult.debugSteps;
      
      // Apply accessibility adjustments
      if (accessibilityData) {
        if (accessibilityData.needsBackground && finalOpacity < 0.5) {
          finalOpacity = Math.max(finalOpacity, 0.5);
        }
        
        if (accessibilityData.wcagCompliant === false && finalOpacity < 0.7) {
          finalOpacity = Math.max(finalOpacity, 0.7);
        }
      }
      
      // Cap at maximum opacity
      finalOpacity = Math.min(finalOpacity, maxOpacity);
    }
    
    // Generate the final background color with opacity
    const backgroundColorWithOpacity = colorUtils.hexToRgba(backgroundColor, finalOpacity);
    
    return {
      backgroundColor: backgroundColorWithOpacity,
      opacity: finalOpacity,
      targetContrast,
      debugSteps
    };
  }, [
    foregroundColor,
    backgroundColor,
    baseBackgroundColor,
    backgroundOpacity,
    minContrastLevel,
    maxOpacity,
    accessibilityData,
    showDebug
  ]);
}