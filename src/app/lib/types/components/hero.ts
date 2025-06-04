import type { ImageMetadata } from '../image';
import { RefObject } from 'react';
import type { ImageObject } from '../image';
import type { CTAType } from '../content';
import type { ColorMap } from '../colorMap';
import type { ElementDebugInfo } from '@/debug/lib/types/debug.types'; // Update import path

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
  headline: string | null;
  cta: CTAType | null;
  headlineRef: RefObject<HTMLHeadingElement | null>;
  getTextColorClass: (elementLabel: string) => string;
  image?: ImageObject | null;
  usePalette?: boolean;
  elementColors?: Record<string, {
    color: 'text-black' | 'text-white' | 'background';
    wcagCompliant?: boolean;
    needsBackground?: boolean;
    debugInfo?: ElementDebugInfo; // Use the proper ElementDebugInfo type
  }>;
}