// Move opacity calculation to its own file
// filepath: c:\Users\cdela\Documents\vanta2025\src\app\lib\utils\opacityCalculator.ts
import { colorUtils } from './colorUtils';

export interface OpacityDebugStep {
  step?: 'initial' | 'fullOpacity' | 'final';
  iteration?: number;
  opacity?: number;
  directContrast?: number;
  fullOpacityContrast?: number;
  targetContrast?: number;
  contrast?: number;
  sufficientWithoutBg?: boolean;
  sufficient?: boolean;
  low?: number;
  high?: number;
  rawOpacity?: number;
  finalOpacity?: number;
  buffer?: string;
}

export const calculateMinimumOpacity = (
  foregroundColor: string,
  backgroundColor: string, 
  baseBackgroundColor: string, 
  targetContrast: number,
  debug = false
): { opacity: number, debugSteps: OpacityDebugStep[] } => {
  
  // Convert colors to RGB
  const fgRgb = colorUtils.hexToRgb(foregroundColor);
  const bgRgb = colorUtils.hexToRgb(backgroundColor);
  const baseBgRgb = colorUtils.hexToRgb(baseBackgroundColor);
  
  // Calculate luminances
  const fgLum = colorUtils.relativeLuminance(fgRgb);
  const bgLum = colorUtils.relativeLuminance(bgRgb);
  const baseBgLum = colorUtils.relativeLuminance(baseBgRgb);

  // Check if we already have sufficient contrast without a background
  const directContrast = colorUtils.contrastRatio(fgLum, baseBgLum);
  
  // Debug steps for tracing the calculation
  const debugSteps: OpacityDebugStep[] = [];
  
  if (debug) {
    debugSteps.push({
      step: 'initial',
      directContrast,
      targetContrast,
      sufficientWithoutBg: directContrast >= targetContrast
    });
  }
  
  if (directContrast >= targetContrast) {
    // No background needed at all
    return { opacity: 0, debugSteps };
  }
  
  // Check if full opacity would provide enough contrast
  const fullOpacityContrast = colorUtils.contrastRatio(fgLum, bgLum);
  
  if (debug) {
    debugSteps.push({
      step: 'fullOpacity',
      fullOpacityContrast,
      targetContrast,
      sufficient: fullOpacityContrast >= targetContrast
    });
  }
  
  if (fullOpacityContrast < targetContrast) {
    // Even full opacity doesn't help
    return { opacity: 1, debugSteps };
  }
  
  // Binary search to find minimum opacity that achieves target contrast
  let low = 0.05; // Start at 5% opacity
  let high = 1;
  let bestOpacity = 1; // Default to full opacity
  
  // Perform binary search for 10 iterations (sufficient precision)
  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2;
    
    // Calculate the blended background luminance with this opacity
    const blendedLum = mid * bgLum + (1 - mid) * baseBgLum;
    
    // Calculate contrast with this blended background
    const currentContrast = colorUtils.contrastRatio(fgLum, blendedLum);
    
    if (debug) {
      debugSteps.push({
        iteration: i,
        opacity: mid,
        contrast: currentContrast,
        sufficient: currentContrast >= targetContrast,
        low,
        high
      });
    }
    
    if (currentContrast >= targetContrast) {
      // This opacity works, try to find a lower one
      bestOpacity = mid;
      high = mid;
    } else {
      // This opacity doesn't provide enough contrast, try higher
      low = mid;
    }
  }
  
  // Add a small buffer (10%) to ensure we're safely above the threshold
  const finalOpacity = Math.min(bestOpacity * 1.1, 0.95);
  
  if (debug) {
    debugSteps.push({
      step: 'final',
      rawOpacity: bestOpacity,
      finalOpacity: finalOpacity,
      buffer: '10%'
    });
  }
  
  return { opacity: finalOpacity, debugSteps };
};