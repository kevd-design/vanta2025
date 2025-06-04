import { useMemo } from 'react';
import type { ImageObject, ImagePalette, ImagePaletteSwatch } from '@/app/lib/types/image';

type PaletteType = 'dominant' | 'darkMuted' | 'darkVibrant' | 'lightMuted' | 'lightVibrant' | 'muted' | 'vibrant';

interface UseSanityPaletteOptions {
  image: ImageObject | null;
  preferredPalette?: PaletteType | PaletteType[];
  fallbackPalette?: PaletteType;
}

export const useSanityPalette = ({ 
  image, 
  preferredPalette = ['dominant', 'darkVibrant', 'vibrant'],
  fallbackPalette = 'dominant' 
}: UseSanityPaletteOptions) => {
  
  return useMemo(() => {
    // Default palette state
    const defaultState = {
      background: '#000000',
      foreground: '#ffffff',
      available: false,
      paletteType: null as PaletteType | null,
      swatch: null as ImagePaletteSwatch | null,
      palette: null as ImagePalette | null
    };
    
    // If no image, return default palette
    if (!image?.asset?.metadata?.palette) {
      return defaultState;
    }
    
    const palette = image.asset.metadata.palette;
    
    // Helper function to check if a swatch is valid
    const isValidSwatch = (swatch: ImagePaletteSwatch | null | undefined): swatch is ImagePaletteSwatch => {
      return !!swatch && 
        typeof swatch.background === 'string' && 
        typeof swatch.foreground === 'string' &&
        swatch.population !== undefined;
    };
    
    // Find the first valid preferred palette type
    let selectedType: PaletteType | null = null;
    let selectedSwatch: ImagePaletteSwatch | null = null;
    
    // Handle array of preferences
    const preferences = Array.isArray(preferredPalette) 
      ? preferredPalette 
      : [preferredPalette];
      
    // Try each preferred palette in order
    for (const type of preferences) {
      const swatch = palette[type];
      if (isValidSwatch(swatch)) {
        selectedType = type;
        selectedSwatch = swatch;
        break;
      }
    }
    
    // If no preferred palette is valid, fall back
    if (!selectedSwatch && fallbackPalette) {
      const fallbackSwatch = palette[fallbackPalette];
      if (isValidSwatch(fallbackSwatch)) {
        selectedType = fallbackPalette;
        selectedSwatch = fallbackSwatch;
      }
    }
    
    // If we still don't have a valid swatch, use the first valid one
    if (!selectedSwatch) {
      const types: PaletteType[] = ['dominant', 'darkVibrant', 'vibrant', 'muted', 'darkMuted', 'lightVibrant', 'lightMuted'];
      for (const type of types) {
        const swatch = palette[type];
        if (isValidSwatch(swatch)) {
          selectedType = type;
          selectedSwatch = swatch;
          break;
        }
      }
    }
    
    // Return the palette info
    return selectedSwatch ? {
      background: selectedSwatch.background,
      foreground: selectedSwatch.foreground,
      available: true,
      paletteType: selectedType,
      swatch: selectedSwatch,
      palette: palette
    } : defaultState;
  }, [image, preferredPalette, fallbackPalette]);
};