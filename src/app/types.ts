import type { 
  ImageAsset, 
  ImageDimensions,
  ImageHotspot,
  ImageCrop,
  
} from '@sanity/types'

export interface LogoType {
  logoForLightBG?: SanityImage | null
  logoForDarkBG?: SanityImage | null
}

export interface LogoProps {
  logo: LogoType
  debug?: boolean
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
  hotspot?: ImageHotspot | null
  crop?: ImageCrop | null
}


export interface NavLabelsType {
  homePageNavLabel: string
  projectsPageNavLabel: string
  aboutPageNavLabel: string
  reviewsPageNavLabel: string
  contactPageNavLabel: string
}

export interface imageType {
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
  crop?: ImageCrop | null;
  hotspot: ImageHotspot | null;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundImage: SanityImage | null;
  navigationItems: NavigationItem[];
  debugInfo: debugInfo | null;
  lqip: string | undefined;
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
  asset: ImageAsset | null;
  hotspot?: {
    x: number;
    y: number;
  } | null;
  crop?: ImageCrop | null;
  width: number;
  height: number;
  quality?: number;
}


// Hero Section
export interface HeroSection {
  headline: string | null;
  image: SanityImage | null;
  cta: CTAType | null;
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


export interface debugInfo {
    url: string | null,
    width: number,
    dpr: number
}

export interface ImageRenderInfo {
  containerWidth: number
  containerHeight: number
  objectFit: 'cover' | 'contain'
  objectPosition: {
    x: number
    y: number
  }
}

