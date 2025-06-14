import type { ImageObject } from '../image';
import type { SanityImage } from '../sanity';

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavLabelsType {
  homePageNavLabel: string;
  projectsPageNavLabel: string;
  aboutPageNavLabel: string;
  reviewsPageNavLabel: string;
  contactPageNavLabel: string;
  mobileBackgroundImage?: ImageObject;

  // Footer properties
  displayCopyright: boolean;
  textBeforeCopyright?: string | null;
  copyrightText?: string | null;
  copyrightYear: boolean;
  textAfterCopyright?: string | null;
}

export interface NavigationProps {
  logo: LogoType;
  navLabels: NavLabelsType;
  mobileBackgroundImage?: ImageObject | SanityImage;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  backgroundImage: ImageObject;
  lqip?: string;
}

export interface MobileNavigationBackgroundProps {
  backgroundImage: ImageObject;
  dimensions: {
    width: number;
    height: number;
  };
  lqip?: string;
  setOptimizedImageUrl?: (url: string) => void;
}

export interface LogoType {
  logoForLightBG?: ImageObject | null;
  logoForDarkBG?: ImageObject | null;
}

export interface LogoProps {
  logo: LogoType;
  debug?: boolean;
}

export interface NavLinkProps {
  href: string
  label: string
  variant: 'desktop' | 'mobile'
  onClick?: () => void
  className?: string
}