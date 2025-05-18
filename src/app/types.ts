import type { 
  ImageAsset, 
  ImageDimensions,
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
  hotspot: {
    x: number
    y: number
    height: number
    width: number
  }  | null
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
    hotspot: {
      x: number;
      y: number;
      height: number;
      width: number;
    } | null;
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
  hotspot?: { x: number; y: number }
  skipRounding?: boolean
  preserveAspectRatio?: boolean
}

export interface UseOptimizedImageProps {
  asset: ImageAsset | null;
  hotspot?: { x: number; y: number }
  width: number
  height: number
  quality?: number
}



// Hero Section
export interface HeroSection {
  headline: string | null;
  image: {
    asset: ImageAsset | null;
    hotspot: { x: number; y: number } | null; 
    metadata?: {
      lqip?: string;
    };
    alt?: string;
  } | null;
  cta: {
    linkLabel?: string;
    linkType?: "toPage" | "externalLink" | "toProject";
    toProject?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    toPage?: "about" | "contact" | "home" | "projects" | "reviews";
    externalLink?: string;
  } | null;
}

// Projects Section
export interface ProjectsSection {
  cta: CtaProps;
}

// Services Section
export interface ServicesSection {
  title: string;
  description: string;
  backgroundImage: {
    asset: ImageAsset;
    hotspot?: { x: number; y: number };
    metadata?: {
      lqip?: string;
    };
  };
  cta: CtaProps;
}

// Review Section
export interface ReviewSection {
  reviewerName: string;
  reviewText: string;
  cta: CtaProps;
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

// 3. Create a type for the query result
export interface HomeQueryResult {
  data: HomeData;
  tags: string[];
}