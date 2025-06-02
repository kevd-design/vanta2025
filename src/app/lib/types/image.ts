import type { SanityImage } from './sanity';
import type { Dimensions } from '@/app/lib/types/layout';

export interface ImageMetadata { // Changed from SanityImageMetadata to ImageMetadata for clarity
  dimensions?: Dimensions | null;
  lqip?: string | null;
}

export interface ImageObject extends SanityImage { // Changed from SanityImageObject to ImageObject for clarity
  _type: 'image' | 'imageWithMetadata';
  asset: SanityImage['asset'] & {
    altText?: string | null;
    metadata?: {
      dimensions?: Dimensions | null;
      lqip?: string | null;
    };
    url?: string;
  };
}

export interface ImageRenderInfo {
  containerWidth: number;
  containerHeight: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition: {
    x: number;
    y: number;
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  debug?: {
    calculatedAspectRatio: number;
    sourceAspectRatio: number;
    originalDimensions?: {
      width: number;
      height: number;
      aspectRatio?: number;
    };
  };
}

export interface ImageMetadata {
  sourceUrl: string;
  transformedUrl: string;
  sourceWidth: number;
  sourceHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  cropRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dpr: number;
}

export interface ImagePaletteSwatch {
  background: string;
  foreground: string;
  population: number;
  title: string;
  _type: string;
}

export interface ImagePalette {
  dominant: ImagePaletteSwatch;
  darkMuted: ImagePaletteSwatch;
  darkVibrant: ImagePaletteSwatch;
  lightMuted: ImagePaletteSwatch;
  lightVibrant: ImagePaletteSwatch;
  muted: ImagePaletteSwatch;
  vibrant: ImagePaletteSwatch;
  _type: string;
}




