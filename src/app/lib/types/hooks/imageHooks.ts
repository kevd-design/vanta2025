import type { 
  SanityAsset, 
  SanityImageCrop, 
} from '@sanity/image-url/lib/types/types'

import type { ImageObject, ImageMetadata } from '../image';
import type { ColorMap } from '../colorMap'
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

export interface UseImageHandlerOptions {
  image: ImageObject | null;
  width: number;
  height?: number;
  quality?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  priority?: boolean;
  onColorMapChange?: (colorMap: ColorMap, metadata?: ImageMetadata) => void;
  onImageUrlGenerated?: (url: string | null) => void;
  isDebugMode?: boolean;
}