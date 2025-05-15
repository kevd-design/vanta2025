import type { 
  ImageAsset, 
  ImageDimensions,
} from '@sanity/types'

export interface LogoType {
  logoForLightBG?: SanityImage | null
  logoForDarkBG?: SanityImage | null
}

export interface SanityImage {
  asset?: ImageAsset & {
    altText?: string | null
    title?: string | null
    metadata?: {
      dimensions?: ImageDimensions | null
      lqip?: string | null
    } | null
  } | null
}


export interface NavLabelsType {
  homePageNavLabel: string
  projectsPageNavLabel: string
  aboutPageNavLabel: string
  reviewsPageNavLabel: string
  contactPageNavLabel: string
}

export interface MobileBackgroundImageType {
  asset: ImageAsset & {
    metadata: {
      lqip: string
      dimensions: {
        aspectRatio: number
        width: number
        height: number
      }
    }
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundImageUrl: string;
  navigationItems: NavigationItem[];
  lqip?: string;
  backgroundImage?: {
    asset: {
      metadata: {
        dimensions: {
          aspectRatio: number;
          height: number;
          width: number;
        };
      };
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
  debugInfo?: {
    url: string;
    width: number;
    dpr: number;
  };
}

export interface CtaProps {
  label?: string;
  linkType?: "toPage" | "externalLink" | "toProject";
  toPage?: string;
  externalLink?: string;
  toProjectSlug?: string;
}