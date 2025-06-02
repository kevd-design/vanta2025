# Organizing TypeScript Types in Your Project

You're right that your project is currently using two different patterns for managing types:

1. Centralized in types.ts (main file approach)
2. Domain-specific files in types directory (modular approach)

Let me help you organize your types consistently following best practices.

## Current Issues

1. **Mixed Type Organization**: Some types are in the main types.ts file, while others are in domain-specific files
2. **Component Props Placement**: Some components have their props defined externally while others define them inline
3. **Related Types Scattered**: Related types like `ElementMapCell` are defined in multiple locations
4. **Redundant Definitions**: Some similar types are defined multiple times with slight variations

## Recommended Organization Pattern

I recommend a **domain-specific organization** with component prop types exported from these files:

```
src/
  lib/
    types/
      sanity.ts         # Only Sanity-specific types and re-exports
      image.ts          # Image-related types 
      content.ts        # Content structure types
      pages.ts          # Page-specific composite types
      components/       # Component prop types
        hero.ts
        navigation.ts
        common.ts
      color-map.ts      # ColorMap related types
      element-map.ts    # ElementMap related types
      layout.ts         # Layout/dimension related types
      common.ts         # Shared utility types
      index.ts          # Re-export everything
```

## Implementation Steps

### 1. Create Domain-Specific Type Files

Let's start by creating the domain-specific type files:

```typescript
import { RefObject } from 'react';
import type { SanityImageObject } from '../image';
import type { CTAType } from '../sanity';
import type { ColorMap } from '../color-map';

export interface HeroSection {
  headline: string | null;
  image: SanityImageObject | null;
  cta: CTAType | null;
}

export interface HeroBackgroundProps {
  image: SanityImageObject;
  dimensions: {
    width: number;
    height: number;
  };
  isDebugMode?: boolean;
  onColorMapChange?: (map: ColorMap, metadata?: ImageMetadata) => void;
  setOptimizedImageUrl?: (url: string) => void;
}

export interface HeroContentProps {
  headline: string | null;
  cta: CTAType | null;
  headlineRef: RefObject<HTMLHeadingElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  getTextColorClass: (elementLabel: string) => string;
}
```

### 2. Organize Navigation Types

```typescript
import type { SanityImageObject } from '../image';

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
  mobileBackgroundImage?: SanityImageObject;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundImage: SanityImageObject;
  navigationItems: NavigationItem[];
  debugInfo?: any | null;
  lqip?: string;
}

export interface LogoType {
  logoForLightBG?: SanityImageObject | null;
  logoForDarkBG?: SanityImageObject | null;
}

export interface LogoProps {
  logo: LogoType;
  debug?: boolean;
}
```

### 3. Organize Image Types

```typescript
import type { 
  SanityAsset, 
  SanityImageCrop, 
  SanityImageHotspot 
} from '@sanity/image-url/lib/types/types';

export interface SanityImageMetadata {
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  } | null;
  lqip?: string | null;
}

export interface SanityImageObject {
  _type: 'image' | 'imageWithMetadata';
  asset: SanityAsset & {
    altText?: string | null;
    metadata?: SanityImageMetadata;
    url?: string;
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
}

export interface ImageRenderInfo {
  containerWidth: number;
  containerHeight: number;
  objectFit: 'cover' | 'contain' | 'fill';
  objectPosition: {
    x: number;
    y: number;
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  debug?: {
    calculatedAspectRatio: number;
    sourceAspectRatio: number;
    originalDimensions?: {
      width: number;
      height: number;
      aspectRatio?: number;
    };
  };
}

export interface ImageMetadata {
  sourceUrl: string;
  transformedUrl: string;
  sourceWidth: number;
  sourceHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  cropRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dpr: number;
}

export interface ImagePaletteSwatch {
  background: string;
  foreground: string;
  population: number;
  title: string;
  _type: string;
}

export interface ImagePalette {
  dominant: ImagePaletteSwatch;
  darkMuted: ImagePaletteSwatch;
  darkVibrant: ImagePaletteSwatch;
  lightMuted: ImagePaletteSwatch;
  lightVibrant: ImagePaletteSwatch;
  muted: ImagePaletteSwatch;
  vibrant: ImagePaletteSwatch;
  _type: string;
}
```

### 4. Create Common Component Props

```typescript
import type { SanityImageObject } from '../image';
import type { ColorMap, ImageMetadata } from '../color-map';
import type { RefObject } from 'react';
import type { ElementMapCell } from '../element-map';

export interface CTAProps {
  linkLabel?: string;
  linkType?: "toPage" | "externalLink" | "toProject";
  toPage?: string;
  externalLink?: string;
  toProjectSlug?: string;
  className?: string;
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
  onColorMapChange?: (colorMap: ColorMap, metadata?: ImageMetadata) => void;
  onImageUrlGenerated?: (url: string | null) => void;
  isDebugMode?: boolean;
}

export interface ImageContainerProps {
  children: (props: {
    dimensions: { width: number; height: number };
    onColorMapChange: (colorMap: ColorMap, metadata?: ImageMetadata) => void;
    elementColors: Record<string, { color: string }>;
    setOptimizedImageUrl?: (url: string) => void;
    imagePalette?: ImagePalette | null;
  }) => React.ReactNode;
  className?: string;
  isDebugMode?: boolean;
  imageId: string;
  displayName: string;
  elementRefs: Array<{
    ref: RefObject<HTMLElement>;
    label: string;
  }>;
  image: SanityImageObject | null;
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
```

### 5. Create the Index.ts to Re-Export Everything

```typescript
// Re-export from all domains
export * from './components/hero';
export * from './components/navigation';
export * from './components/common';
export * from './color-map';
export * from './element-map';
export * from './image';
export * from './sanity';
export * from './layout';
export * from './common';
```

## Component Structure with Imports

Now let's update a couple of components to show the pattern you should follow:

### HeroContent.tsx with New Type Import

```tsx
import { FC } from 'react'
import CTA from './common/Cta'
import { HeroContentProps } from '@/lib/types'

export const HeroContent: FC<HeroContentProps> = ({
  headline,
  cta,
  headlineRef,
  ctaRef,
  getTextColorClass
}) => (
  <div className="relative z-15 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
    <div className="w-full flex flex-col items-center md:pt-[40vh] space-y-8">
      {headline && (
        <h1 
          ref={headlineRef}
          className={`font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight px-12 ${getTextColorClass('Headline')}`}
        >
          {headline}
        </h1>
      )}
      {cta && (
        <div 
          ref={ctaRef} 
          className={getTextColorClass('CTA')}
        >
          <CTA {...cta} />
        </div>
      )}
    </div>
  </div>
)
```

### TextBackground Component (New)

```tsx
'use client'

import { FC } from 'react'
import { TextBackgroundProps } from '@/lib/types'

export const TextBackground: FC<TextBackgroundProps> = ({
  children,
  swatch,
  className = '',
  opacity = 0.8,
  blur = 0,
  padding = 'px-4 py-2',
  rounded = true
}) => {
  // Default styles if no swatch is provided
  const defaultStyle = {
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    color: 'white',
    backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined
  };
  
  // Use swatch data if available
  const style = swatch ? {
    backgroundColor: `${swatch.background.replace(')', `, ${opacity})`).replace('rgb', 'rgba')}`,
    color: swatch.foreground,
    backdropFilter: blur > 0 ? `blur(${blur}px)` : undefined
  } : defaultStyle;
  
  return (
    <span 
      className={`${padding} ${rounded ? 'rounded' : ''} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};
```

## Benefits of This Approach

1. **Scalability**: Types are organized by domain, making it easier to add new types
2. **Maintainability**: Related types are grouped together
3. **Imports**: Clean import paths (e.g., `@/lib/types`)
4. **IDE Support**: Better autocomplete since types are in domain-specific files
5. **Consistency**: One standard pattern throughout the project

This approach provides a good balance between having everything in one file (which gets unwieldy) and scattering types across component files (which makes reuse difficult).

## Recommendations

1. **Move Component Props to Type Files**: Keep component implementations clean by moving their prop interfaces to the type files
2. **Use Named Exports**: Export everything with names rather than default exports
3. **Consistent Naming**: Use suffix conventions like `...Props` for component props
4. **Group Related Types**: Keep related types in the same file
5. **Use Barrel Files**: Use index.ts re-exports for easier imports
6. **Consider Potential Reuse**: If a type might be reused across components, put it in a domain file rather than a component-specific file

This organization will significantly improve your codebase's maintainability as it continues to grow.