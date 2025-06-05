import React, { ReactNode } from 'react';
import { usePaletteContrast } from '@/app/hooks/usePaletteContrast';
import { useBackgroundProcessor } from '@/app/hooks/useBackgroundProcessor';
import { AdaptiveTextDebugInfo } from './AdaptiveTextDebugInfo';
import type { ImageObject } from '@/app/lib/types/image';

export type PaletteType = 'dominant' | 'darkMuted' | 'darkVibrant' | 'lightMuted' | 'lightVibrant' | 'muted' | 'vibrant';

export interface PalettePreference {
  type: PaletteType;
  minContrast?: number;
  useAsBackground?: boolean;
}

export interface AdaptiveTextProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  image?: ImageObject | null;
    // Palette options
  preferences?: (PaletteType | PalettePreference)[];
  orderByPopulation?: boolean;
  minPopulation?: number;
  minContrast?: number;
  againstDark?: boolean;
  // Background and styling options
  backgroundOpacity?: number | "auto";
  minContrastLevel?: "AA" | "AAA";
  maxOpacity?: number;
  padding?: string;
  showDebug?: boolean;
  forceWhitespace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces';
  accessibilityData?: {
    needsBackground?: boolean;
    wcagCompliant?: boolean;
  };
}

export const AdaptiveText = React.forwardRef<HTMLElement, AdaptiveTextProps>(({ 
  children,
  className = '',
  as: Component = 'div',
  image = null,
  preferences = ['darkVibrant', 'vibrant', 'dominant'],
  orderByPopulation = true,
  minPopulation = 0.05,
  minContrast = 4.5,
  againstDark = false,
  backgroundOpacity = 0.85,
  minContrastLevel = "AAA",
  maxOpacity = 0.95,
  padding = 'px-4 py-2',
  showDebug = false,
  forceWhitespace,
  accessibilityData,
}, ref) => {
  // Extract accessibility info - simplified without legacy system
  const needsBackground = accessibilityData?.needsBackground;

  // Get palette result
  const result = usePaletteContrast({
    image,
    preferences,
    orderByPopulation,
    minPopulation,
    minContrast,
    backgroundColor: againstDark ? '#000000' : '#ffffff',
    againstDark,
    accessibilityData: { needsBackground }
  });
  
  // Base styles and classes
  const styles: React.CSSProperties = {};
  let debugInfo = null;
  
  if (forceWhitespace) {
    styles.whiteSpace = forceWhitespace;
  }
  
  // Determine if background is needed - move this outside the conditional
  const forceBackground = result?.needsBackground || accessibilityData?.needsBackground;
  
  // Set up base background color
  const baseBackgroundColor = againstDark ? '#000000' : '#ffffff';
  
  // IMPORTANT: Use the hook unconditionally with safe default values
  const bgProcessor = useBackgroundProcessor({
    foregroundColor: result?.foregroundColor || '#000000',
    backgroundColor: result?.backgroundColor || '#ffffff',
    baseBackgroundColor,
    backgroundOpacity,
    minContrastLevel,
    maxOpacity,
    needsBackground: !!forceBackground, // Convert to boolean
    showDebug,
    accessibilityData
  });
  
  // Now do conditional styling based on the hook's results
  if (result) {
    if (forceBackground) {
      // Set text color
      styles.color = result.foregroundColor;
      
      // Apply background color with opacity
      styles.backgroundColor = bgProcessor.backgroundColor;
      
      // Generate debug info
      if (showDebug) {
        debugInfo = (
          <AdaptiveTextDebugInfo
            backgroundColor={result.backgroundColor}
            foregroundColor={result.foregroundColor}
            opacity={bgProcessor.opacity}
            contrastRatio={result.contrastRatio}
            wcagLevel={result.wcagLevel}
            backgroundOpacity={backgroundOpacity}
            minContrastLevel={minContrastLevel}
            targetContrast={bgProcessor.targetContrast}
            accessibilityData={accessibilityData}
            debugSteps={bgProcessor.debugSteps}
            population={result.population}
          />
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
  
  // Determine when padding should be applied
  const shouldApplyPadding = forceBackground;
  
  return (
    <Component 
      ref={ref}
      className={`${className} ${
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