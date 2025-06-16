import type { ImageObject, ImageMetadata, ImagePaletteSwatch  } from '../image';
import type { SanityImage } from '../sanity';
import type { ColorMap } from '../colorMap';
import type { RefObject } from 'react';
import type { CTAType } from '@/app/lib/types/content';

// Add the missing ServicesProps interface
export interface ServicesProps {
  title: string | null;
  description: string | null;
  backgroundImage: ImageObject | null;
  cta: CTAType | null;
}

export interface CTAProps {
  linkLabel?: string;
  linkType?: "toPage" | "externalLink" | "toProject";
  toPage?: string;
  externalLink?: string;
  toProject?: string; // Add this line to match the CTAType interface
  toProjectSlug?: string; // Keep this for backward compatibility
  className?: string;
}

// Add ReviewProps type definition
export interface ReviewProps {
  reviewerName: string | null;
  reviewText: string | null;
  cta: CTAType | null;
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
    setOptimizedImageUrl: (url: string) => void 
  }) => React.ReactNode
  className?: string
  imageId?: string
  displayName?: string
  elementRefs?: Array<{ 
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

export interface ProjectProps {
  title: string | null;
  slug: string | null;
  image: ImageObject | null;
  description?: string | null;
  cta?: CTAType | null;
  isAlternate?: boolean;
}

