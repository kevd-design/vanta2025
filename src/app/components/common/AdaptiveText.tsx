import React, { ReactNode } from 'react';
import { usePaletteContrast } from '@/app/hooks/usePaletteContrast';
import type { ImageObject } from '@/app/lib/types/image';

type PaletteType = 'dominant' | 'darkMuted' | 'darkVibrant' | 'lightMuted' | 'lightVibrant' | 'muted' | 'vibrant';

interface OpacityDebugStep {
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

interface PalettePreference {
  type: PaletteType;
  minContrast?: number;
  useAsBackground?: boolean;
}

interface AdaptiveTextProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  image?: ImageObject | null;
  // Color system options
  colorClass?: string;  // For legacy system (text-black, text-white, background)
  // Palette options
  preferences?: (PaletteType | PalettePreference)[];
  orderByPopulation?: boolean;
  minPopulation?: number;
  minContrast?: number;
  againstDark?: boolean;
  // Background and styling options
  backgroundOpacity?: number | "auto";
  minContrastLevel?: "AA" | "AAA";
  maxOpacity?: number; // Add maximum opacity limit
  padding?: string;
  showDebug?: boolean;
  forceWhitespace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
  accessibilityData?: {
    needsBackground?: boolean;
    wcagCompliant?: boolean;
  };
}

const calculateMinimumOpacity = (
  foregroundColor: string,
  backgroundColor: string, 
  baseBackgroundColor: string, 
  targetContrast: number,
  debug = false
): { opacity: number, debugSteps: OpacityDebugStep[] } => {
  // Helper function to convert hex to rgb array
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  // Calculate relative luminance for sRGB color
  const relativeLuminance = (rgb: [number, number, number]): number => {
    const srgb = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };
  
  // Calculate contrast ratio between two luminances
  const contrastRatio = (l1: number, l2: number): number => {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  
  // Convert colors to RGB
  const fgRgb = hexToRgb(foregroundColor);
  const bgRgb = hexToRgb(backgroundColor);
  const baseBgRgb = hexToRgb(baseBackgroundColor);
  
  // Calculate luminances
  const fgLum = relativeLuminance(fgRgb);
  const bgLum = relativeLuminance(bgRgb);
  const baseBgLum = relativeLuminance(baseBgRgb);

  // Check if we already have sufficient contrast without a background
  const directContrast = contrastRatio(fgLum, baseBgLum);
  
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
  const fullOpacityContrast = contrastRatio(fgLum, bgLum);
  
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
    const currentContrast = contrastRatio(fgLum, blendedLum);
    
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

export const AdaptiveText = React.forwardRef<HTMLElement, AdaptiveTextProps>(({ 
  children,
  className = '',
  as: Component = 'div',
  image = null,
  colorClass,
  preferences = ['darkVibrant', 'vibrant', 'dominant'],
  orderByPopulation = true,
  minPopulation = 0.05,
  minContrast = 4.5,
  againstDark = false,
  backgroundOpacity = 0.85,
  minContrastLevel = "AAA",
  maxOpacity = 0.95, // Add maximum opacity limit
  padding = 'px-4 py-2',
  showDebug = false,
  forceWhitespace,
  accessibilityData,
}, ref) => {
  // Use the legacy color class system if provided
  const useLegacySystem = !!colorClass;
  
  // Extract accessibility info from colorClass if not explicitly provided
  const needsBackground = accessibilityData?.needsBackground || 
    (useLegacySystem && colorClass === 'background');

  // ALWAYS call the palette contrast hook
  const paletteResult = usePaletteContrast({
    image,
    preferences,
    orderByPopulation,
    minPopulation,
    minContrast,
    backgroundColor: againstDark ? '#000000' : '#ffffff',
    againstDark,
    accessibilityData: {
      needsBackground
    }
  });
  
  // Only USE the result when not in legacy mode
  const result = !useLegacySystem ? paletteResult : null;
  
  // Create styles based on the selected system
  const styles: React.CSSProperties = {};
  let backgroundClasses = '';
  let debugInfo = null;
  
  if (forceWhitespace) {
    styles.whiteSpace = forceWhitespace;
  }
  
  // Set up conditional styling based on system
  if (useLegacySystem) {
    // Handle legacy system (AccessibilityMap output)
    if (colorClass === 'background') {
      backgroundClasses = 'bg-black/50';
      styles.color = '#ffffff';
    } else if (colorClass === 'text-black') {
      styles.color = '#000000';
    } else if (colorClass === 'text-white') {
      styles.color = '#ffffff';
    } else {
      // If colorClass is a custom value, use it directly
      return (
        <Component 
          ref={ref}
          className={`${className} ${colorClass || ''}`}
          style={styles}
        >
          {children}
        </Component>
      );
    }
  } else if (result) {
    // Determine if background is needed based on multiple factors
    const forceBackground = 
      accessibilityData?.needsBackground || // From accessibility system
      result.needsBackground; // From palette system
      
    // Handle palette system
    if (forceBackground) {
      // Convert hex to rgba for background opacity
      const hexToRgba = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };
      
      styles.color = result.foregroundColor;
      
      // Calculate the minimum required opacity if "auto" is specified
      let finalOpacity = typeof backgroundOpacity === 'number' ? backgroundOpacity : 0.85;
      let opacityCalcDetails = null;
      // Define targetContrast here so it's accessible in the debug section
      const targetContrast = minContrastLevel === 'AAA' ? 7.0 : 4.5;
      
      if (backgroundOpacity === 'auto') {
        // Use the already defined targetContrast value
        
        // Calculate minimum opacity for target contrast
        const opacityResult = calculateMinimumOpacity(
          result.foregroundColor,
          result.backgroundColor,
          againstDark ? '#000000' : '#ffffff', // Base background color
          targetContrast,
          showDebug // Pass debug flag
        );
        
        finalOpacity = opacityResult.opacity;
        opacityCalcDetails = opacityResult.debugSteps;
        
        // Apply accessibility adjustments
        if (accessibilityData) {
          // If accessibility says background is definitely needed, ensure at least 50% opacity
          if (accessibilityData.needsBackground && finalOpacity < 0.5) {
            finalOpacity = Math.max(finalOpacity, 0.5);
            if (showDebug) {
              console.log('Adjusting opacity to minimum 50% due to accessibility requirements');
            }
          }
          
          // If not WCAG compliant, increase opacity
          if (accessibilityData.wcagCompliant === false && finalOpacity < 0.7) {
            finalOpacity = Math.max(finalOpacity, 0.7);
            if (showDebug) {
              console.log('Adjusting opacity to minimum 70% due to WCAG failure');
            }
          }
        }
        
        // Cap at maximum opacity
        finalOpacity = Math.min(finalOpacity, maxOpacity);
        
        // Log the calculated opacity for debugging
        if (showDebug) {
          console.log('Auto opacity calculation:', {
            baseColor: result.backgroundColor,
            finalOpacity: finalOpacity.toFixed(2),
            targetContrast,
            wcagLevel: minContrastLevel,
            accessibilityNeeds: accessibilityData?.needsBackground,
            steps: opacityCalcDetails
          });
        }
      }
      
      // Apply the background with calculated or specified opacity
      styles.backgroundColor = hexToRgba(result.backgroundColor, finalOpacity);
      
      if (showDebug) {
        debugInfo = (
          <div className="absolute top-0 right-0 bg-black/75 text-white text-xs p-1 max-w-[250px] overflow-auto">
            <div className="font-bold">BG: {result.backgroundColor} @ {(finalOpacity * 100).toFixed(0)}%</div>
            <div>FG: {result.foregroundColor}</div>
            <div>Contrast: {result.contrastRatio.toFixed(2)}:1 ({result.wcagLevel})</div>
            
            {backgroundOpacity === 'auto' && (
              <>
                <div className="mt-1 border-t border-white/20 pt-1 font-bold">Auto Opacity Info:</div>
                <div>Target: {minContrastLevel} ({targetContrast.toFixed(1)}:1)</div>
                <div>Accessibility needs BG: {accessibilityData?.needsBackground ? 'Yes' : 'No'}</div>
                <div>Source: {accessibilityData?.needsBackground ? 'Accessibility Map' : 'Palette'}</div>
                {opacityCalcDetails?.[0]?.directContrast !== undefined && (
                  <div className="text-xs text-green-300">
                    {opacityCalcDetails[0].directContrast < targetContrast ? 
                      "Background needed for contrast" : 
                      "Direct contrast sufficient"}
                  </div>
                )}
              </>
            )}
            
            {result.population !== undefined && (
              <div className="mt-1">Swatch Pop: {(result.population * 100).toFixed(1)}%</div>
            )}
          </div>
        );
      }
    } else {
      // No background needed
      styles.color = result.color;
      
      if (showDebug) {
        debugInfo = (
          <div className="absolute top-0 right-0 bg-black/75 text-white text-xs p-1">
            <div>Color: {result.color}</div>
            <div>{result.isFromPalette ? `Palette: ${result.paletteType}` : 'Fallback'}</div>
            <div>Contrast: {result.contrastRatio.toFixed(2)}:1 ({result.wcagLevel})</div>
            <div>BG needed: No</div>
            {result.population !== undefined && (
              <div>Pop: {(result.population * 100).toFixed(1)}%</div>
            )}
          </div>
        );
      }
    }
  }
  
  // Determine when padding should be applied - only when there's a background
  const shouldApplyPadding = 
    (useLegacySystem && colorClass === 'background') ||
    (result?.needsBackground) || 
    (accessibilityData?.needsBackground);
  
  return (
    <Component 
      ref={ref}
      className={`${className} ${backgroundClasses} ${
        shouldApplyPadding ? padding : ''
      } ${showDebug ? 'relative' : ''}`}
      style={styles}
    >
      {children}
      {debugInfo}
    </Component>
  );
});

AdaptiveText.displayName = 'AdaptiveText';