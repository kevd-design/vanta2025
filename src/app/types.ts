import type { 
  ImageAsset, 
  ImageDimensions,
  ImageHotspot,
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
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot: ImageHotspot | null;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundImage: {
    asset: ImageAsset | null;
    hotspot: ImageHotspot | null;
    metadata?: {
      lqip?: string;
    };
  } | null;
  navigationItems: Array<{
    label: string;
    href: string;
  }>;
  debugInfo?: {
    url: string;
    width: number;
    dpr: number;
  };
  lqip?: string;
}


export interface CtaProps {
  linkLabel?: string;
  linkType?: "toPage" | "externalLink" | "toProject";
  toPage?: string;
  externalLink?: string;
  toProjectSlug?: string;
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
  hotspot: ImageHotspot | null;
  width: number
  height: number
  quality?: number
}



// Hero Section
export interface HeroSection {
  headline: string | null;
  image: {
    asset: ImageAsset | null;
    hotspot: ImageHotspot | null;
    metadata?: {
      lqip?: string;
    };
    alt?: string;
  } | null;
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

