import type { ImageObject, ImageMetadata, ImagePaletteSwatch  } from '../image';
import type { SanityImage } from '../sanity';
import type { ColorMap } from '../colorMap';
import type { RefObject } from 'react';

export interface CTAProps {
  linkLabel?: string;
  linkType?: "toPage" | "externalLink" | "toProject";
  toPage?: string;
  externalLink?: string;
  toProjectSlug?: string;
  className?: string;
}

export interface OptimizedImageProps {
  image: ImageObject | SanityImage;
  width: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  showDebug?: boolean;
  onColorMapChange?: (colorMap: ColorMap, metadata?: ImageMetadata) => void;
  onImageUrlGenerated?: (url: string | null) => void;
  isDebugMode?: boolean;
}

export interface ImageContainerProps {
  children: (params: {
    containerRef: React.RefObject<HTMLDivElement | null>
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
    colorMap: ColorMap
    elementColors: Record<string, {
      color: 'text-black' | 'text-white' | 'background'
      debugInfo: {
        totalCells: number
        blackVotes: number
        whiteVotes: number
        consensusPercentage: number
      }
    }>
    onColorMapChange: (map: ColorMap) => void
    isDebugMode?: boolean
    setOptimizedImageUrl: (url: string) => void 
  }) => React.ReactNode
  className?: string
  isDebugMode?: boolean
  imageId: string
  displayName?: string
  elementRefs: Array<{ 
    ref: RefObject<HTMLElement | null>
    label: string 
  }>
  image?: ImageObject | null
  setOptimizedImageUrl?: (url: string) => void
  
}

export interface TextBackgroundProps {
  children: React.ReactNode;
  paletteType?: 'dominant' | 'darkMuted' | 'darkVibrant' | 'lightMuted' | 'lightVibrant' | 'muted' | 'vibrant';
  swatch?: ImagePaletteSwatch;
  className?: string;
  opacity?: number;
  blur?: number;
  padding?: string;
  rounded?: boolean;
}