import type { ImageObject, ImagePaletteSwatch  } from '../image';
import type { CTAType } from '@/app/lib/types/content';

// Add the missing ServicesProps interface
export interface ServicesProps {
  title: string | null;
  description: string | null;
  backgroundImage: ImageObject | null;
  cta: CTAType | null;
}

export interface CTAProps {
  linkLabel: string;
  toPage?: string;
  linkType: "externalLink" | "toPage" | "toProject";
  externalLink?: string;
  toProjectSlug?: string;
  className?: string;
}

// Add ReviewProps type definition
export interface ReviewProps {
  reviewerName: string | null;
  reviewText: string | null;
  cta: CTAType | null;
}

export interface OptimizedImageProps {
  image: ImageObject | null;
  width: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  showDebug?: boolean;
  onImageUrlGenerated?: (url: string | null) => void;
}

// Other common component types...

export interface ImageContainerProps {
  children: (props: {
    dimensions: {
      width: number;
      height: number;
    };
    setOptimizedImageUrl: (url: string) => void;
  }) => React.ReactNode;
  className?: string;
  setOptimizedImageUrl?: (url: string) => void;
}

export interface TextBackgroundProps {
  children: React.ReactNode;
  paletteType?: 'dominant' | 'darkMuted' | 'darkVibrant' | 'lightMuted' | 'lightVibrant' | 'muted' | 'vibrant';
  swatch?: ImagePaletteSwatch;
  className?: string;
  opacity?: number;
  blur?: number;
  padding?: string;
  rounded?: boolean;
}

export interface ProjectProps {
  title: string | null;
  slug: string | null;
  image: ImageObject | null;
  description?: string | null;
  cta?: CTAType | null;
  isAlternate?: boolean;
}

