import { useMemo } from 'react';
import type { ImageObject, ImagePaletteSwatch } from '@/app/lib/types/image';

type PaletteType = 'dominant' | 'darkMuted' | 'darkVibrant' | 'lightMuted' | 'lightVibrant' | 'muted' | 'vibrant';

interface PalettePreference {
  type: PaletteType;
  minContrast?: number;
  useAsBackground?: boolean;
}

interface UsePaletteContrastOptions {
  image: ImageObject | null;
  orderByPopulation?: boolean;
  minPopulation?: number;
  preferences?: (PaletteType | PalettePreference)[];
  minContrast?: number;
  backgroundColor?: string;
  againstDark?: boolean;
  accessibilityData?: {
    needsBackground?: boolean;
    wcagCompliant?: boolean;
  };
}

interface ContrastResult {
  color: string;
  isFromPalette: boolean;
  paletteType: PaletteType | null;
  contrastRatio: number;
  needsBackground: boolean;
  wcagLevel: 'fail' | 'AA' | 'AAA';
  foregroundColor: string;
  backgroundColor: string;
  population?: number;
}

// Helper to calculate contrast ratio between two colors
const getContrastRatio = (color1: string, color2: string): number => {
  // Convert hex to rgb
  const hexToRgb = (hex: string): {r: number, g: number, b: number} => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Calculate luminance
  const luminance = (rgb: {r: number, g: number, b: number}): number => {
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// Helper function to check if a swatch is valid
const isValidSwatch = (swatch: ImagePaletteSwatch ): boolean => {
  return !!swatch && 
    typeof swatch.background === 'string' && 
    typeof swatch.foreground === 'string' &&
    swatch.population !== undefined;
};

export const usePaletteContrast = ({
  image,
  orderByPopulation = true,
  minPopulation = 0.05,
  preferences = ['darkVibrant', 'vibrant', 'dominant', 'muted', 'darkMuted', 'lightVibrant', 'lightMuted'],
  minContrast = 4.5,
  backgroundColor = '#ffffff',
  againstDark = false,
  accessibilityData // New parameter to receive external accessibility info
}: UsePaletteContrastOptions): ContrastResult => {
  
  return useMemo(() => {
    // Default result handling
    const defaultResult: ContrastResult = {
      color: againstDark ? '#ffffff' : '#000000',
      isFromPalette: false,
      paletteType: null,
      contrastRatio: againstDark ? 21 : 21,
      needsBackground: false,
      wcagLevel: 'AAA',
      foregroundColor: againstDark ? '#ffffff' : '#000000',
      backgroundColor: backgroundColor
    };
    
    if (!image?.asset?.metadata?.palette) {
      return defaultResult;
    }
    
    const palette = image.asset.metadata.palette;
    const types: PaletteType[] = ['dominant', 'darkVibrant', 'vibrant', 'muted', 'darkMuted', 'lightVibrant', 'lightMuted'];
    
    // Get all valid swatches
    const validSwatches = types
      .filter(type => isValidSwatch(palette[type]))
      .map(type => ({
        type,
        swatch: palette[type]
      }));
      
    if (validSwatches.length === 0) {
      return defaultResult;
    }
    
    // Sort swatches by preferred order
    let sortedSwatches = [...validSwatches];
    
    if (orderByPopulation) {
      // Filter by minimum population
      sortedSwatches = sortedSwatches
        .filter(item => item.swatch.population >= minPopulation)
        .sort((a, b) => b.swatch.population - a.swatch.population);
    }
    
    // Apply preference ordering
    if (preferences.length > 0) {
      const normalizedPrefs = preferences.map(pref => 
        typeof pref === 'string' ? pref : pref.type
      );
      
      // Move preferred types to the front while preserving relative order
      sortedSwatches.sort((a, b) => {
        const aIndex = normalizedPrefs.indexOf(a.type);
        const bIndex = normalizedPrefs.indexOf(b.type);
        
        if (aIndex >= 0 && bIndex >= 0) {
          return aIndex - bIndex; // Both in preferences - order by preference
        } else if (aIndex >= 0) {
          return -1; // Only a is in preferences - a comes first
        } else if (bIndex >= 0) {
          return 1;  // Only b is in preferences - b comes first
        }
        
        // Neither in preferences - keep current order
        return orderByPopulation ? 
          b.swatch.population - a.swatch.population : // By population
          0; // Preserve original order
      });
    }
    
    // Skip color testing if accessibility system already determined need for background
    if (accessibilityData?.needsBackground) {
      // If accessibility system says we need background, go straight to background mode
      const fallbackBackgroundSwatch = sortedSwatches[0]?.swatch;
      
      if (fallbackBackgroundSwatch) {
        const bgColor = fallbackBackgroundSwatch.background;
        const textColor = fallbackBackgroundSwatch.foreground;
        const contrastRatio = getContrastRatio(textColor, bgColor);
        
        return {
          color: 'background',
          isFromPalette: true,
          paletteType: sortedSwatches[0].type,
          contrastRatio,
          needsBackground: true,
          wcagLevel: contrastRatio >= 7 ? 'AAA' : 'AA',
          foregroundColor: textColor,
          backgroundColor: bgColor,
          population: fallbackBackgroundSwatch.population
        };
      }
    }
    
    // Try to find a swatch with sufficient contrast
    const fallbackBackgroundSwatch = sortedSwatches[0]?.swatch || null;
    
    for (const {type, swatch} of sortedSwatches) {
      // Calculate contrast using Sanity's foreground color
      const contrastWithBackground = getContrastRatio(swatch.foreground, backgroundColor);
      
      // If contrast is sufficient, use this swatch
      if (contrastWithBackground >= minContrast) {
        return {
          color: swatch.foreground, // Use Sanity's calculated foreground color
          isFromPalette: true,
          paletteType: type,
          contrastRatio: contrastWithBackground,
          needsBackground: false,
          wcagLevel: contrastWithBackground >= 7 ? 'AAA' : 'AA',
          foregroundColor: swatch.foreground,
          backgroundColor: backgroundColor,
          population: swatch.population
        };
      }
    }
    
    // No swatch has good direct contrast - try creating a background
    if (fallbackBackgroundSwatch) {
      const bgColor = fallbackBackgroundSwatch.background;
      
      // Use Sanity's provided foreground color for this background
      const textColor = fallbackBackgroundSwatch.foreground;
      
      // Double-check the contrast to be sure
      const contrastRatio = getContrastRatio(textColor, bgColor);
      
      if (contrastRatio >= minContrast) {
        return {
          color: 'background', // Special value indicating background mode
          isFromPalette: true,
          paletteType: sortedSwatches[0].type,
          contrastRatio,
          needsBackground: true,
          wcagLevel: contrastRatio >= 7 ? 'AAA' : 'AA',
          foregroundColor: textColor, // Use Sanity's recommended foreground
          backgroundColor: bgColor,
          population: fallbackBackgroundSwatch.population
        };
      }
    }
    
    // Last resort - use safe black/white
    return defaultResult;
  }, [image, preferences, minContrast, backgroundColor, againstDark, orderByPopulation, minPopulation, accessibilityData]);
};