// Re-export official Sanity types we use
import type {
  SanityAsset,
  SanityImageCrop,
  SanityImageHotspot
} from '@sanity/image-url/lib/types/types';

export interface SanityImage {
  _type: 'image' | 'imageWithMetadata';
  asset: SanityAsset; // Use the imported SanityAsset type
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  caption?: string;
}

// Define our Sanity-specific schema interfaces
export interface SanityReference {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

// Type for query responses
export interface SanityQueryResponse<T> {
  query: string;
  result: T;
  ms?: number;
}