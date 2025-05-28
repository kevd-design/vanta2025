Collecting workspace information# Integrating Sanity with Server-Side Accessibility Processing

You've identified an important integration point - using Sanity as the image source and leveraging its capabilities to improve our accessibility processing. Let's modify the server-side plan to seamlessly integrate with Sanity:

## 1. Leverage Sanity Image Metadata at Upload Time

Since Sanity already processes images through its asset pipeline, we can enhance this with image analysis during upload:

```typescript
// src/sanity/hooks/useImageUploadEnhancer.ts
import { useCallback } from 'react';
import { useClient } from 'sanity';
import { analyzeSanityImage } from '../utils/imageAnalysisUtils';

export function useImageUploadEnhancer() {
  const client = useClient({ apiVersion: '2023-03-25' });
  
  const enhanceImageOnUpload = useCallback(async (imageAsset) => {
    if (!imageAsset || !imageAsset._id) return imageAsset;
    
    try {
      // Get palette data from Sanity (already processed by Sanity)
      const palette = imageAsset?.metadata?.palette;

      // Run accessibility analysis and generate contrast data
      const accessibilityData = await analyzeSanityImage(imageAsset.url, palette);
      
      // Store accessibility data back in Sanity
      await client.patch(imageAsset._id)
        .set({
          metadata: {
            ...imageAsset.metadata,
            accessibility: accessibilityData
          }
        })
        .commit();
        
      return {
        ...imageAsset,
        metadata: {
          ...imageAsset.metadata,
          accessibility: accessibilityData
        }
      };
    } catch (error) {
      console.error('Failed to enhance image with accessibility data:', error);
      return imageAsset;
    }
  }, [client]);
  
  return { enhanceImageOnUpload };
}
```

## 2. Create a Sanity Document Hook for Images

Add a custom hook to automatically analyze images when they're added to Sanity:

```typescript
// src/sanity/schemaTypes/image/hooks/useImageAccessibility.ts
import { useEffect } from 'react';
import { useDocumentOperation } from 'sanity';
import { analyzeImageAccessibility } from '../utils/imageAnalysisUtils';

export function useImageAccessibility(props) {
  const { id, type, draft, published } = props;
  const { patch } = useDocumentOperation(id, type);

  useEffect(() => {
    // Only run when we have a new image asset
    if (draft?.asset?._ref && draft?.asset?._ref !== published?.asset?._ref) {
      const imageRef = draft.asset._ref;
      
      // Start processing the image - this happens after the initial save
      analyzeImageAccessibility(imageRef).then(accessibilityData => {
        // Store accessibility results with the image
        patch.execute([
          {
            set: {
              accessibilityData: {
                dominantColors: accessibilityData.dominantColors,
                contrastData: accessibilityData.contrastData,
                recommendedOverlayColors: accessibilityData.recommendedOverlayColors,
                textColorRecommendations: accessibilityData.textColorRecommendations
              }
            }
          }
        ]);
      });
    }
  }, [draft?.asset?._ref, published?.asset?._ref, patch]);

  return null;
}
```

## 3. Add Sanity Integration to Next.js API Route

Create an API route to handle on-demand image analysis when needed:

```typescript
// src/app/api/image-accessibility/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { analyzeSanityImage } from '@/sanity/utils/imageAnalysisUtils';
import { getSanityPalette } from '@/sanity/utils/sanityImageUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get('id');
  
  if (!imageId) {
    return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
  }
  
  try {
    // Check if we already have accessibility data for this image
    const imageData = await client.fetch(`*[_type == "sanity.imageAsset" && _id == $id][0]`, { 
      id: imageId 
    });
    
    // If accessibility data already exists, return it
    if (imageData?.metadata?.accessibility) {
      return NextResponse.json({ accessibility: imageData.metadata.accessibility });
    }
    
    // Otherwise, analyze the image
    const palette = imageData?.metadata?.palette;
    const accessibilityData = await analyzeSanityImage(imageData.url, palette);
    
    // Store the result back to Sanity for future use
    await client.patch(imageId)
      .setIfMissing({ metadata: {} })
      .set({
        'metadata.accessibility': accessibilityData
      })
      .commit();
    
    return NextResponse.json({ accessibility: accessibilityData });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
```

## 4. Enhance Sanity Schema Types to Include Accessibility Data

Update your image schema to include accessibility-related fields:

```typescript
// src/sanity/schemaTypes/image/imageType.ts
import { defineField, defineType } from 'sanity';
import ImageInput from './components/ImageInput';
import { useImageAccessibility } from './hooks/useImageAccessibility';

export const imageType = defineType({
  name: 'imageWithMetadata',
  type: 'image',
  title: 'Image',
  // ... existing configuration
  
  options: {
    hotspot: true,
    metadata: ['blurhash', 'lqip', 'palette'],
    requiredFields: ['title', 'altText'],
  },
  
  components: {
    input: ImageInput,
  },
  
  // Add document action to run accessibility analysis
  document: {
    // @ts-ignore - Custom hook for document operations
    useHooks: (props) => {
      useImageAccessibility(props);
      return props;
    }
  },
  
  fields: [
    // ... existing fields
    
    // New fields for accessibility data
    defineField({
      name: 'accessibilityData',
      type: 'object',
      title: 'Accessibility Data',
      description: 'Automatically generated accessibility information for this image',
      readOnly: true,
      hidden: true,
      fields: [
        {
          name: 'dominantColors',
          type: 'array',
          of: [{ type: 'string' }]
        },
        {
          name: 'contrastData',
          type: 'object',
          fields: [
            { name: 'avgLuminance', type: 'number' },
            { name: 'varianceScore', type: 'number' },
            { name: 'recommendedTextColor', type: 'string' }
          ]
        },
        {
          name: 'recommendedOverlayColors',
          type: 'object',
          fields: [
            { name: 'light', type: 'string' },
            { name: 'dark', type: 'string' },
            { name: 'preferred', type: 'string' }
          ]
        }
      ]
    })
  ],
  
  // ... rest of the schema
})
```

## 5. Create a Component to Visualize Image Accessibility in Sanity Studio

Add a custom component to show accessibility information in the Sanity Studio:

```tsx
// src/sanity/schemaTypes/image/components/AccessibilityPreview.tsx
import { Box, Card, Flex, Text, Stack, Badge } from '@sanity/ui';
import { useState, useEffect } from 'react';
import { client } from '../../../lib/client';

interface AccessibilityPreviewProps {
  value: {
    asset?: { _ref: string };
  };
}

export function AccessibilityPreview({ value }: AccessibilityPreviewProps) {
  const [accessibilityData, setAccessibilityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!value?.asset?._ref) return;
    
    setIsLoading(true);
    
    // Fetch the image asset with metadata
    client.fetch(`*[_type == "sanity.imageAsset" && _id == $id][0]{
      metadata {
        palette,
        accessibility
      }
    }`, { id: value.asset._ref })
      .then(result => {
        setAccessibilityData(result?.metadata?.accessibility || null);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch accessibility data:', err);
        setIsLoading(false);
      });
  }, [value?.asset?._ref]);
  
  if (isLoading) {
    return <Box padding={4}>Loading accessibility data...</Box>;
  }
  
  if (!accessibilityData) {
    return (
      <Card padding={4} tone="caution">
        <Text size={1}>No accessibility data available. Save the document to generate.</Text>
      </Card>
    );
  }
  
  const { contrastData, recommendedOverlayColors } = accessibilityData;
  
  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        <Text weight="semibold" size={2}>Accessibility Information</Text>
        
        <Flex gap={2}>
          <Box flex={1}>
            <Text size={1} weight="medium">Recommended Text Color</Text>
            <Badge tone={contrastData.recommendedTextColor === 'text-white' ? 'positive' : 'primary'}>
              {contrastData.recommendedTextColor === 'text-white' ? 'White' : 'Black'}
            </Badge>
          </Box>
          
          <Box flex={1}>
            <Text size={1} weight="medium">Text Background Needed?</Text>
            <Badge tone={contrastData.varianceScore > 0.15 ? 'caution' : 'positive'}>
              {contrastData.varianceScore > 0.15 ? 'Yes' : 'No'}
            </Badge>
          </Box>
        </Flex>
        
        {contrastData.varianceScore > 0.15 && (
          <Box>
            <Text size={1} weight="medium">Recommended Overlay Color</Text>
            <Flex gap={2} marginTop={2}>
              <Box 
                style={{ 
                  width: 30, 
                  height: 30, 
                  backgroundColor: recommendedOverlayColors.preferred,
                  borderRadius: '4px'
                }} 
              />
              <Text size={1}>{recommendedOverlayColors.preferred}</Text>
            </Flex>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
```

## 6. Use Sanity Palette Data for Background Overlays

Create a utility to extract optimal overlay colors from Sanity's palette:

```typescript
// src/app/(site)/utils/sanityPaletteUtils.ts
import { getPaletteSwatchHex } from './colorUtils';

export interface SanityPalette {
  darkMuted?: { background?: string };
  lightVibrant?: { background?: string };
  darkVibrant?: { background?: string };
  vibrant?: { background?: string };
  dominant?: { background?: string };
  muted?: { background?: string };
  lightMuted?: { background?: string };
}

interface OverlayRecommendation {
  light: string;
  dark: string;
  preferred: string;
}

export function getOptimalOverlayFromPalette(
  palette: SanityPalette | undefined,
  textColor: 'text-black' | 'text-white' | 'background',
  opacity = 0.6
): OverlayRecommendation {
  // Default overlay colors
  const defaults = {
    light: 'rgba(255, 255, 255, 0.6)',
    dark: 'rgba(0, 0, 0, 0.6)',
    preferred: 'rgba(0, 0, 0, 0.6)'
  };
  
  if (!palette) return defaults;
  
  try {
    // Extract hex colors from palette
    const darkHex = getPaletteSwatchHex(palette.darkMuted) || getPaletteSwatchHex(palette.darkVibrant);
    const lightHex = getPaletteSwatchHex(palette.lightMuted) || getPaletteSwatchHex(palette.lightVibrant);
    
    // Convert to RGBA with proper opacity
    const darkRgba = darkHex ? hexToRgba(darkHex, opacity) : defaults.dark;
    const lightRgba = lightHex ? hexToRgba(lightHex, opacity) : defaults.light;
    
    // Choose preferred overlay based on text color recommendation
    const preferred = textColor === 'text-white' ? darkRgba : 
                    textColor === 'text-black' ? lightRgba : 
                    darkRgba; // Default to dark for 'background' case
    
    return {
      light: lightRgba,
      dark: darkRgba,
      preferred
    };
  } catch (error) {
    console.error('Error processing palette for overlay:', error);
    return defaults;
  }
}

// Helper to convert hex to RGBA
function hexToRgba(hex: string, alpha = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

## 7. Modify useAccessibilityMap to Use Sanity Palette

Update your `useAccessibilityMap` hook to incorporate the Sanity palette data:

```typescript
// src/app/(site)/hooks/useAccessibilityMap.ts
import { useState, useEffect } from 'react';
import type { ColorMap } from '../../types/colorMap';
import type { ElementMap } from '../../types/elementMap';
import { getOptimalOverlayFromPalette, type SanityPalette } from '../utils/sanityPaletteUtils';

interface AccessibilityOptions {
  consensusThreshold: number;
  contrastThreshold: number;
  palette?: SanityPalette;
}

type AccessibilityResult = {
  elementColors: {
    [key: string]: {
      color: 'text-black' | 'text-white' | 'background';
      overlay?: {
        color: string;
        source: 'palette' | 'default';
      };
      debugInfo: {
        totalCells: number;
        blackVotes: number;
        whiteVotes: number;
        consensusPercentage: number;
      };
    };
  };
};

export const useAccessibilityMap = (
  colorMap: ColorMap,
  elementMap: ElementMap,
  options: AccessibilityOptions = {
    consensusThreshold: 0.95,
    contrastThreshold: 0.5
  }
): AccessibilityResult => {
  const [result, setResult] = useState<AccessibilityResult>({
    elementColors: {}
  });

  useEffect(() => {
    // Existing validation and processing code...
    
    try {
      const elementVotes = {}; // Your existing vote counting logic
      
      // Calculate results for each element
      const newResults: AccessibilityResult = {
        elementColors: {}
      };

      Object.entries(elementVotes).forEach(([label, votes]) => {
        // Skip if no votes were registered
        if (votes.total === 0) return;
        
        const blackConsensus = votes.black / votes.total;
        const whiteConsensus = votes.white / votes.total;
        const bestConsensus = Math.max(blackConsensus, whiteConsensus);

        const textColor = bestConsensus >= options.consensusThreshold
          ? (blackConsensus > whiteConsensus ? 'text-black' : 'text-white')
          : 'background';
        
        // Create overlay if needed based on Sanity palette
        let overlay;
        if (textColor === 'background' && options.palette) {
          const overlayColors = getOptimalOverlayFromPalette(
            options.palette, 
            blackConsensus > whiteConsensus ? 'text-black' : 'text-white'
          );
          
          overlay = {
            color: overlayColors.preferred,
            source: 'palette'
          };
        } else if (textColor === 'background') {
          // Default overlay when no palette is available
          overlay = {
            color: 'rgba(0, 0, 0, 0.6)',
            source: 'default'
          };
        }

        newResults.elementColors[label] = {
          color: textColor,
          ...(overlay && { overlay }),
          debugInfo: {
            totalCells: votes.total,
            blackVotes: votes.black,
            whiteVotes: votes.white,
            consensusPercentage: bestConsensus
          }
        };
      });

      setResult(newResults);
    } catch (error) {
      console.error('Error in useAccessibilityMap:', error);
    }
  }, [colorMap, elementMap, options]);

  return result;
};
```

## 8. Connect ImageContainer to Sanity Data with Image Palette

Update your `ImageContainer` to pass Sanity palette data:

```tsx
// src/app/(site)/components/common/ImageContainer.tsx
import { FC, useRef, useState, useEffect, useCallback, RefObject } from 'react'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useImageDimensions } from '../../hooks/useImageDimensions'
import { useDebounce } from '../../hooks/useDebounce'
import { useColorMap } from '../../context/ColorMapContext'
import { useElementMap } from '../../hooks/useElementMap'
import { useAccessibilityMap } from '../../hooks/useAccessibilityMap'
import { useDebugObserver } from '../../hooks/useDebugObserver'
import type { ColorMap } from '../../../types/colorMap'
import type { SanityImageObject } from '../../../types'
import type { SanityPalette } from '../../utils/sanityPaletteUtils'

interface ImageContainerProps {
  children: (params: {
    containerRef: React.RefObject<HTMLDivElement | null>
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
    colorMap: ColorMap
    elementColors: Record<string, {
      color: 'text-black' | 'text-white' | 'background'
      overlay?: {
        color: string
        source: 'palette' | 'default'
      }
      debugInfo: {
        totalCells: number
        blackVotes: number
        whiteVotes: number
        consensusPercentage: number
      }
    }>
    onColorMapChange: (map: ColorMap) => void
    isDebugMode?: boolean
    setOptimizedImageUrl: (url: string) => void
  }) => React.ReactNode
  className?: string
  isDebugMode?: boolean
  imageId: string
  displayName?: string
  elementRefs: Array<{ 
    ref: RefObject<HTMLElement | null>
    label: string 
  }>
  image?: SanityImageObject | null
  setOptimizedImageUrl?: (url: string) => void 
}

export const ImageContainer: FC<ImageContainerProps> = ({
  children,
  className,
  isDebugMode,
  imageId,
  displayName,
  elementRefs,
  image,
  setOptimizedImageUrl: externalSetOptimizedImageUrl
}) => {
  // Existing state and hooks...
  
  // Extract palette from Sanity image metadata
  const palette = image?.asset?.metadata?.palette as SanityPalette | undefined;
  
  // Pass palette to accessibility analysis
  const { elementColors } = useAccessibilityMap(colorMap, elementMap, {
    consensusThreshold: 0.95,
    contrastThreshold: 0.5,
    palette
  });
  
  // Rest of your component...
}
```

## 9. Use Server Components to Pre-Render with Sanity Data

Create a server component that fetches and uses Sanity data for static rendering:

```tsx
// src/app/(site)/components/Hero.server.tsx
import { draftMode } from 'next/headers'
import { client } from '@/sanity/lib/client';
import { HeroClient } from './Hero.client';

interface HeroServerProps {
  heroId: string;
}

export async function HeroServer({ heroId }: HeroServerProps) {
  const isDraftMode = draftMode().isEnabled;
  
  // Fetch hero data with the image metadata included
  const heroData = await client.fetch(`
    *[_type == "heroSection" && _id == $heroId][0] {
      headline,
      cta {
        linkLabel,
        linkType,
        toProject->{
          _id,
          projectName,
          projectSlug
        },
        toPage,
        externalLink
      },
      image {
        ...,
        asset-> {
          ...,
          metadata {
            dimensions,
            palette,
            lqip,
            accessibility
          }
        }
      }
    }
  `, { heroId }, { next: { tags: [`hero:${heroId}`] } });
  
  // If we have pre-analyzed accessibility data, use it for SSR
  const accessibilityData = heroData?.image?.asset?.metadata?.accessibility;
  const palette = heroData?.image?.asset?.metadata?.palette;
  
  // If we're in draft mode or don't have accessibility data, client-side calculation will be used
  const useClientAnalysis = isDraftMode || !accessibilityData;
  
  return (
    <HeroClient
      headline={heroData.headline}
      cta={heroData.cta}
      image={heroData.image}
      preAnalyzedData={useClientAnalysis ? undefined : accessibilityData}
      palette={palette}
    />
  );
}
```

## 10. Update useDebugObserver to Include Sanity Palette Information

```typescript
// src/app/(site)/hooks/useDebugObserver.ts
import { useEffect } from 'react';
import { useDebugLayout } from '../context/DebugLayoutContext';
import type { SanityPalette } from '../utils/sanityPaletteUtils';

interface UseDebugObserverProps {
  componentId: string;
  displayName: string;
  colorMap?: ColorMap;
  elementMap?: ElementMapCell[][];
  elementColors?: Record<string, any>;
  image?: SanityImageObject;
  optimizedImageUrl?: string;
  dimensions?: { width: number; height: number };
  palette?: SanityPalette;
  enabled?: boolean;
}

export const useDebugObserver = ({
  componentId,
  displayName,
  colorMap,
  elementMap,
  elementColors,
  image,
  optimizedImageUrl,
  dimensions,
  palette,
  enabled = true
}: UseDebugObserverProps) => {
  const { setDebugContent } = useDebugLayout();
  
  // Existing observer logic...
  
  useEffect(() => {
    if (!enabled) return;
    
    const debugContent: DebugContent = {
      componentId,
      displayName,
      colorMap,
      elementMap,
      dimensions,
      accessibilityResults: { elementColors },
      palette,  // Include palette data in debug output
      ...(image?.asset?.url && optimizedImageUrl && {
        imageDebug: {
          imageUrl: optimizedImageUrl || image.asset.url,
          // Existing image debug info...
        }
      })
    };
    
    setDebugContent(debugContent);
  }, [
    enabled,
    setDebugContent,
    componentId,
    displayName,
    colorMap,
    elementMap,
    elementColors,
    image,
    optimizedImageUrl,
    dimensions,
    palette  // Add palette to dependency array
  ]);
};
```

## 11. Add a Custom Component to Visualize Sanity Color Palette in Debug UI

```tsx
// src/app/debug/components/SanityPaletteDebug.tsx
import { FC } from 'react';
import type { SanityPalette } from '@/app/(site)/utils/sanityPaletteUtils';

interface SanityPaletteDebugProps {
  palette?: SanityPalette;
}

export const SanityPaletteDebug: FC<SanityPaletteDebugProps> = ({ palette }) => {
  if (!palette) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 text-xs text-gray-400">
        No palette data available
      </div>
    );
  }
  
  // Extract all palette swatches
  const swatches = [
    { name: 'Dominant', color: palette.dominant?.background },
    { name: 'Vibrant', color: palette.vibrant?.background },
    { name: 'Light Vibrant', color: palette.lightVibrant?.background },
    { name: 'Dark Vibrant', color: palette.darkVibrant?.background },
    { name: 'Muted', color: palette.muted?.background },
    { name: 'Light Muted', color: palette.lightMuted?.background },
    { name: 'Dark Muted', color: palette.darkMuted?.background }
  ].filter(s => s.color);
  
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 text-xs text-gray-100 min-w-[200px]">
      <h3 className="font-bold mb-2 text-white">Sanity Color Palette</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {swatches.map(swatch => (
          <div key={swatch.name} className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border border-gray-700"
              style={{ backgroundColor: swatch.color }}
            />
            <div>
              <div className="text-white">{swatch.name}</div>
              <div className="text-gray-400 text-[10px]">{swatch.color}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Color harmony visualization */}
      <div className="mt-4">
        <div className="font-medium border-b border-gray-700 pb-1 text-white mb-2">
          Color Harmony
        </div>
        <div className="flex h-6 w-full rounded-md overflow-hidden">
          {swatches.map(swatch => (
            <div
              key={swatch.name}
              style={{ backgroundColor: swatch.color }}
              className="flex-1 h-full transition-all duration-300 hover:flex-[2]"
              title={`${swatch.name}: ${swatch.color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

## 12. Update DebugPanel to Show Palette Visualization

```tsx
// src/app/debug/components/DebugPanel.tsx
import { FC, useState } from 'react';
import { AccessibilityDebug } from './AccessibilityDebug';
import { ImageDebug } from './ImageDebug';
import { SanityPaletteDebug } from './SanityPaletteDebug';

export const DebugPanel: FC<DebugPanelProps> = ({ 
  initialContent,
  resizeState = 'idle',
  latestViewport 
}) => {
  // Existing code...
  
  // Always render the panel if we have either local or context content
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Existing navigation... */}
      
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-8">
          {/* Component Info */}
          <div className="bg-gray-800/70 rounded-lg p-4">
            {/* Existing component info... */}
          </div>
          
          {/* Accessibility Visualization */}
          {showDebugVisuals && contentToDisplay?.colorMap && (
            <AccessibilityDebug
              colorMap={contentToDisplay.colorMap}
              elementMap={contentToDisplay.elementMap}
              dimensions={contentToDisplay.dimensions}
              screenDimensions={{
                width: window.innerWidth,
                height: window.innerHeight
              }}
              accessibilityResults={contentToDisplay.accessibilityResults}
              imageUrl={contentToDisplay.imageDebug?.imageUrl}
              viewportInfo={latestViewport}
              scrollState={scrollState}
            />
          )}
          
          {/* Image Debug */}
          {showDebugVisuals && contentToDisplay?.imageDebug && (
            <ImageDebug
              displayName={contentToDisplay.displayName || 'Image'}
              imageUrl={contentToDisplay.imageDebug.imageUrl}
              renderInfo={contentToDisplay.imageDebug.renderInfo}
              screenDimensions={{
                width: window.innerWidth,
                height: window.innerHeight
              }}
            />
          )}
          
          {/* Sanity Palette Visualization */}
          {showDebugVisuals && contentToDisplay?.palette && (
            <SanityPaletteDebug palette={contentToDisplay.palette} />
          )}
        </div>
      </div>
    </div>
  );
}
```

## 13. Add Serverless Function for On-Demand Image Analysis Revalidation

```typescript
// src/app/api/revalidate-image/route.ts
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { client } from '@/sanity/lib/client';
import { analyzeSanityImage } from '@/sanity/utils/imageAnalysisUtils';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get('id');
  const secret = searchParams.get('secret');
  
  // Validate the request
  if (!imageId) {
    return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
  }
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  try {
    // Get the image from Sanity
    const imageData = await client.fetch(`*[_type == "sanity.imageAsset" && _id == $id][0]`, { 
      id: imageId 
    });
    
    if (!imageData) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // Analyze the image
    const palette = imageData?.metadata?.palette;
    const accessibilityData = await analyzeSanityImage(imageData.url, palette);
    
    // Store the result back to Sanity
    await client.patch(imageId)
      .setIfMissing({ metadata: {} })
      .set({
        'metadata.accessibility': accessibilityData
      })
      .commit();
    
    // Revalidate the image in Next.js cache
    revalidateTag(`image:${imageId}`);
    
    // Find documents that reference this image and revalidate them too
    const referringDocs = await client.fetch(`*[references($imageId)]._id`, { 
      imageId 
    });
    
    // Revalidate each document
    for (const docId of referringDocs) {
      revalidateTag(`doc:${docId}`);
    }
    
    return NextResponse.json({ 
      revalidated: true,
      analyzed: true,
      image: imageId,
      references: referringDocs.length
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

## 14. Add Sanity Webhook for Image Updates

Set up a Sanity webhook to trigger reanalysis when images are updated:

```typescript
// src/app/api/webhooks/sanity/route.ts
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate webhook secret
    const signature = request.headers.get('sanity-webhook-signature');
    if (signature !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Handle image asset updates
    if (body._type === 'sanity.imageAsset') {
      // Revalidate the image
      revalidateTag(`image:${body._id}`);
      
      // Trigger image analysis
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate-image?id=${body._id}&secret=${process.env.REVALIDATION_SECRET}`, {
        method: 'POST'
      });
    }
    
    // Handle document updates that contain images
    if (body.image && body.image.asset && body.image.asset._ref) {
      // Revalidate the document
      revalidateTag(`doc:${body._id}`);
      
      // Revalidate the image
      const imageId = body.image.asset._ref;
      revalidateTag(`image:${imageId}`);
    }
    
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

## 15. Add Overlay Component Using Sanity Palette

```tsx
// src/app/(site)/components/common/PaletteOverlay.tsx
'use client';

import { FC, useMemo } from 'react';
import { getOptimalOverlayFromPalette, type SanityPalette } from '../../utils/sanityPaletteUtils';

interface PaletteOverlayProps {
  palette?: SanityPalette;
  textColor: 'text-black' | 'text-white' | 'background';
  className?: string;
  children?: React.ReactNode;
}

export const PaletteOverlay: FC<PaletteOverlayProps> = ({
  palette,
  textColor,
  className = '',
  children
}) => {
  const overlayStyle = useMemo(() => {
    // Only add overlay for 'background' text or when explicitly requested
    if (textColor !== 'background' && !forceOverlay) {
      return {};
    }
    
    const overlayColors = getOptimalOverlayFromPalette(
      palette, 
      // When text is 'background', we need to pick a contrast color
      textColor === 'background' ? 'text-white' : textColor
    );
    
    return {
      backgroundColor: overlayColors.preferred
    };
  }, [palette, textColor, forceOverlay]);
  
  // Apply default styling if no custom class provided
  const defaultClass = !className ? 'px-4 py-2 rounded-md' : '';
  
  return (
    <div className={`${defaultClass} ${className}`} style={overlayStyle}>
      {children}
    </div>
  );
}
```

## 16. Use the Palette Overlay in Hero Content

```tsx
// src/app/(site)/components/HeroContent.tsx
import { FC } from 'react'
import CTA from './common/Cta'
import { PaletteOverlay } from './common/PaletteOverlay'
import { HeroContentProps } from '../../types'

export const HeroContent: FC<HeroContentProps> = ({
  headline,
  cta,
  headlineRef,
  ctaRef,
  getTextColorClass,
  palette
}) => (
  <div className="relative z-15 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
    <div className="w-full flex flex-col items-center md:pt-[40vh] space-y-8">
      {headline && (
        <PaletteOverlay
          palette={palette}
          textColor={getTextColorClass('Headline').includes('background') ? 'background' : 
                    getTextColorClass('Headline').includes('text-white') ? 'text-white' : 'text-black'}
          className={`px-6 py-2 rounded-lg`}
        >
          <h1 
            ref={headlineRef}
            className={`font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight ${
              getTextColorClass('Headline') === 'background' ? 'text-white' : getTextColorClass('Headline')
            }`}
          >
            {headline}
          </h1>
        </PaletteOverlay>
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

## Summary of Sanity Integration Approach

This implementation offers several advantages for your Sanity-based workflow:

1. **Asset Pipeline Integration**:
   - Images are analyzed during upload to Sanity
   - Palette and accessibility data are stored directly with the asset
   - Leverages Sanity's built-in palette generation capabilities

2. **Server-Side Rendering**:
   - Pre-analyzed accessibility data is used during SSR
   - No client-side computation needed for static content
   - Fallback to client analysis only when necessary

3. **Dynamic Content Updates**:
   - Webhooks trigger reanalysis when images change
   - Cache invalidation ensures fresh data
   - Next.js revalidation keeps pages up to date

4. **Enhanced Visual Design**:
   - Background overlays use colors from image palette
   - Creates cohesive visual relationship between text and images
   - Maintains accessibility while enhancing aesthetics

5. **Improved Debug Experience**:
   - Visual representation of Sanity palette in debug panel
   - Clear indication of which colors came from palette vs. defaults
   - Comprehensive metadata for troubleshooting

6. **Developer Experience**:
   - Clear separation between server and client responsibilities
   - Consistent API for accessing accessibility data
   - Smooth integration with Sanity Studio

This approach efficiently combines the power of Sanity's content management with Next.js server-side capabilities to deliver accessible, visually cohesive content with minimal client-side overhead.

Similar code found with 2 license types