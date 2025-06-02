import type { 
  SanityAsset, 
  SanityImageCrop, 
} from '@sanity/image-url/lib/types/types'

import type { ImageHotspot } from '@sanity/types'

export interface UseOptimizedImageProps {
  asset: SanityAsset | null;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  crop?: SanityImageCrop | null;
  width: number;
  height: number;
  quality?: number;
}

export interface ImageUrlOptions {
  quality?: number;
  dpr?: number;
  hotspot?: ImageHotspot | null;
  crop?: SanityImageCrop | null;
  skipRounding?: boolean;
}


export type DimensionTracker = {
  width: number;
  height: number;
};

export interface UseImageRenderInfoProps {
  containerWidth: number
  containerHeight: number
  hotspot?: {
    x: number
    y: number
  } | null
  objectFit?: 'cover' | 'contain'
}