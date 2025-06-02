import type { ImageObject } from '../image'
import type { SanityImage } from '../sanity';
import type { DebugInfo } from '@/debug'

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
}

export interface NavigationProps {
  logo: LogoType;
  navLabels: NavLabelsType;
  mobileBackgroundImage?: ImageObject | SanityImage;
}

export interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  backgroundImage: ImageObject | SanityImage
  navigationItems: NavigationItem[]
  debugInfo: DebugInfo | null
  lqip?: string
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
  className?: string // Add className prop
}