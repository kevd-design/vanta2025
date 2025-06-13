import type { ImageMetadata } from '../image';
import type { ImageObject } from '../image';
import type { CTAType } from '../content';
import type { ColorMap } from '../colorMap';

export interface HeroSection {
  headline: string | null;
  image: ImageObject | null;
  cta: CTAType | null;
  usePalette?: boolean;
}

export interface HeroBackgroundProps {
  image: ImageObject;
  dimensions: {
    width: number;
    height: number;
  };
  isDebugMode?: boolean;
  onColorMapChange?: (map: ColorMap, metadata?: ImageMetadata) => void;
  setOptimizedImageUrl?: (url: string) => void;
}

export interface HeroContentProps {
  headline?: string | null;
  cta?: CTAType | null;
  image?: ImageObject | null;
}