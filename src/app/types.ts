import type { 
  ImageAsset, 
  ImageHotspot,
  ImageCrop,
} from '@sanity/types'

import type { 
  SanityAsset, 
  SanityImageCrop, 
  SanityImageHotspot 
} from '@sanity/image-url/lib/types/types'

import type { RefObject } from 'react'

import type { ColorMap, ImageMetadata as ColorMapImageMetadata } from './types/colorMap';


// Base image types
export interface SanityImageMetadata {
  dimensions?: {
    width: number
    height: number
    aspectRatio: number
  } | null
  lqip?: string | null
}

export interface Dimensions {
  width: number
  height: number
  aspectRatio: number
}

export interface SanityImageObject {
  _type: 'image' | 'imageWithMetadata'
  asset: SanityAsset & {
    altText?: string | null
    metadata?: SanityImageMetadata
    url?: string
  }
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
  alt?: string 
}

export interface LogoType {
  logoForLightBG?: SanityImageObject | null
  logoForDarkBG?: SanityImageObject | null
}

export interface LogoProps {
  logo: LogoType
  debug?: boolean
}

export interface NavigationProps {
  logo: LogoType
  navLabels: NavLabelsType
  mobileBackgroundImage?: SanityImageObject
}


export interface NavLabelsType {
  homePageNavLabel: string
  projectsPageNavLabel: string
  aboutPageNavLabel: string
  reviewsPageNavLabel: string
  contactPageNavLabel: string
}
export interface NavigationItem {
  label: string;
  href: string;
}

export interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  backgroundImage: SanityImageObject
  navigationItems: NavigationItem[]
  debugInfo: DebugInfo | null
  lqip?: string
}

export interface CtaProps {
  linkLabel?: string;
  linkType?: "toPage" | "externalLink" | "toProject";
  toPage?: string;
  externalLink?: string;
  toProjectSlug?: string;
  className?: string;
}

export interface UrlOptions {
  quality?: number
  dpr?: number
  hotspot: ImageHotspot | null;
  skipRounding?: boolean
  preserveAspectRatio?: boolean
}

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


// Hero Section
export interface HeroSection {
  headline: string | null
  image: SanityImageObject | null
  cta: CTAType | null
}

// Projects Section
export interface ProjectsSection {
  cta: CTAType;
}

// Services Section
export interface ServicesSection {
  title: string;
  description: string;
  backgroundImage: {
    asset: ImageAsset;
    hotspot: ImageHotspot | null;
    crop: ImageCrop | null;
    metadata?: {
      lqip?: string;
    };
  };
  cta: CTAType;
}

// Review Section
export interface ReviewSection {
  reviewerName: string;
  reviewText: string;
  cta: CTAType;
}

// Meta Section
export interface MetaSection {
  title: string;
  description: string;
}

// 2. Create the main HomeData interface
export interface HomeData {
  hero: HeroSection;
  projects: ProjectsSection;
  services: ServicesSection;
  review: ReviewSection;
  meta: MetaSection;
}

export interface QueryHomeResult {
  hero: {
    headline: string | null;
    image: {
      asset: ImageAsset | null;
      crop: ImageCrop | null;
      hotspot: ImageHotspot | null;
      alt: string | null;
    } | null;
    cta: CTAType | null;
  };
  projects: {
    cta: CTAType;
  };
  services: {
    title: string;
    description: string;
    backgroundImage: {
      asset: ImageAsset;
      hotspot: ImageHotspot | null;
      ImageCrop: ImageCrop | null;
      metadata?: {
      lqip?: string;
    };
    };
    cta: CTAType;
  };
  review: {
    reviewerName: string;
    reviewText: string;
    cta: CTAType;
  };
  meta: {
    title: string;
    description: string;
  };
}

export interface CTAType {
  linkLabel: string;
  linkType: "toPage" | "externalLink" | "toProject";
  toProject?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  toPage?: "about" | "contact" | "home" | "projects" | "reviews";
  externalLink?: string;
}


export interface DebugInfo {
  hasColorMap: boolean;
  hasElementMap: boolean;
  elementColors: Record<string, {
    color: string;
    background?: boolean;
  }>;
}

interface BaseImageOptions {
  containerWidth: number
  containerHeight: number 
  hotspot?: SanityImageHotspot | null
}

export interface ImageRenderInfo {
  containerWidth: number
  containerHeight: number
  objectFit: 'cover' | 'contain' | 'fill'
  objectPosition: {
    x: number
    y: number
  }
  hotspot?: {
    x: number
    y: number
    width: number
    height: number
  }
  debug?: {
    calculatedAspectRatio: number
    sourceAspectRatio: number
    originalDimensions?: {
      width: number
      height: number
      aspectRatio?: number
    }
  }
}

export interface ColorMapOptions extends BaseImageOptions {
  objectFit: 'cover' | 'contain'
  objectPosition: {
    x: number
    y: number
  }
}

export interface ImageUrlOptions {
  quality?: number;
  dpr?: number;
  hotspot?: ImageHotspot | null;
  crop?: SanityImageCrop | null;
  skipRounding?: boolean;
}

export interface OptimizedImageProps {
  image: SanityImageObject;
  width: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  showDebug?: boolean;
  onColorMapChange?: (colorMap: ColorMap, metadata?: ColorMapImageMetadata) => void;
  onImageUrlGenerated?: (url: string | null) => void;
}

export interface ElementMap {
  ref: RefObject<HTMLElement | null>;
  label: string;
  rect?: DOMRect;
}

export interface ElementMapRef {
  ref: RefObject<HTMLDivElement | HTMLHeadingElement | null>;
  label: string;
}

// Color Map Types
export interface ColorMapOptions {
  containerWidth: number
  containerHeight: number
}

export interface ColorMapOverlayProps {
  colorMap: ColorMap 
  show: boolean
}

export interface ImageColorMapOptions {
  containerWidth: number;
  containerHeight: number;
  hotspot?: SanityImageHotspot | null;
  objectFit: 'cover' | 'contain'; 
  objectPosition: {
    x: number;
    y: number;
  };
}

export interface ColorMapResult {
  colorMap: ColorMap
  dimensions: {
    width: number
    height: number
  }
}
export interface ImageDebugOverlayProps {
  show: boolean
  imageUrl: string
  renderInfo: Partial<ImageRenderInfo>
  screenDimensions: {
    width: number
    height: number
  }
}

export interface CropDimensions {
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  hotspot: SanityImageHotspot | null;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeroBackgroundProps {
  image: SanityImageObject;
  dimensions: {
    width: number;
    height: number;
  };
  isDebugMode?: boolean;
  onColorMapChange?: (map: ColorMap, metadata?: ColorMapImageMetadata) => void;
  setOptimizedImageUrl?: (url: string) => void;
}

export interface ElementMapResult {
  elementMap: ElementMapCell[][];
  debugInfo: {
    totalElements: number;
    coveredCells: number;
  };
}

export interface UseElementMapReturn {
  elementMap: ElementMap[]
}

export interface ElementMapCell {
  isElement: boolean;
  elementLabel?: string;
}

export interface ElementMapOverlayProps {
  elementMap: ElementMapCell[][];
  show: boolean;
}

export interface HeroContentProps {
  headline: string | null
  cta: CTAType | null
  headlineRef: RefObject<HTMLHeadingElement | null>
  ctaRef: RefObject<HTMLDivElement | null>
  getTextColorClass: (elementLabel: string) => string
}

export type DebouncedFunction<Args extends unknown[], Return> = {
  (...args: Args): Return
  cancel: () => void
  flush: () => void
}

export interface ViewportInfo {
  scrollY: number
  scrollX: number
  width: number
  height: number
  zoomLevel: number
  dpr?: number
}