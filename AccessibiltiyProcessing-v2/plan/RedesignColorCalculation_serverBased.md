# Optimizing Color Contrast Calculations for Server-Side Rendering in Next.js

You're absolutely right to consider server-side optimization for accessibility contrast calculations. With Next.js's SSR/SSG capabilities, we can move significant portions of the color analysis to build time or server runtime, reducing client-side overhead.

Here's how to modify our implementation plan to leverage Next.js server-side capabilities:

## 1. Server-Side Image Analysis Pipeline

### Create an Image Analysis API Route

```typescript
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { calculatePerceptualLuminance, calculateColorVariance } from '@/app/(site)/utils/colorUtils';
import type { ColorMapMetadata } from '@/app/(site)/types/color';

export async function POST(req: Request) {
  try {
    const { imageUrl, regions } = await req.json();
    
    // Fetch image data
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.statusText}` },
        { status: 400 }
      );
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const image = sharp(Buffer.from(imageBuffer));
    const metadata = await image.metadata();
    
    // Get image dimensions
    const { width, height } = metadata;
    
    if (!width || !height) {
      return NextResponse.json(
        { error: 'Could not determine image dimensions' },
        { status: 400 }
      );
    }
    
    // Process each requested region
    const analysisResults = await Promise.all(
      regions.map(async (region: any) => {
        const { id, x, y, width: regionWidth, height: regionHeight } = region;
        
        // Extract region from image
        const regionBuffer = await image
          .extract({
            left: Math.floor(x * width),
            top: Math.floor(y * height),
            width: Math.ceil(regionWidth * width),
            height: Math.ceil(regionHeight * height)
          })
          .raw()
          .toBuffer();
          
        // Convert raw pixels to RGB values
        const pixelCount = regionBuffer.length / 3; // Assuming RGB format
        const rgbValues = [];
        
        for (let i = 0; i < pixelCount; i++) {
          const offset = i * 3;
          rgbValues.push([
            regionBuffer[offset],
            regionBuffer[offset + 1],
            regionBuffer[offset + 2]
          ]);
        }
        
        // Calculate average color and other metrics
        const avgColor = [
          Math.round(rgbValues.reduce((sum, [r]) => sum + r, 0) / pixelCount),
          Math.round(rgbValues.reduce((sum, [, g]) => sum + g, 0) / pixelCount),
          Math.round(rgbValues.reduce((sum, [, , b]) => sum + b, 0) / pixelCount)
        ];
        
        const avgLuminance = calculatePerceptualLuminance(avgColor as [number, number, number]);
        const colorVariance = calculateColorVariance(rgbValues);
        
        // Determine text colors
        const recommendedTextColor = avgLuminance > 0.5 ? 'black' : 'white';
        const isBorderline = avgLuminance > 0.4 && avgLuminance < 0.6;
        const hasHighVariance = colorVariance > 0.25;
        
        // Calculate contrast with both black and white text
        const blackContrast = (avgLuminance + 0.05) / 0.05;
        const whiteContrast = 1.05 / (avgLuminance + 0.05);
        const contrastRatio = Math.max(blackContrast, whiteContrast);
        
        return {
          id,
          avgColor,
          avgLuminance,
          colorVariance,
          recommendedTextColor,
          isBorderline,
          hasHighVariance,
          contrastRatio
        };
      })
    );
    
    // Return analysis results with metadata
    const responseData = {
      results: analysisResults,
      metadata: {
        imageUrl,
        originalWidth: width,
        originalHeight: height,
        timestamp: Date.now()
      } as ColorMapMetadata
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error processing image analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process image analysis' },
      { status: 500 }
    );
  }
}
```

### Create a Cache System

```typescript
import { Redis } from '@upstash/redis';
import { revalidatePath } from 'next/cache';

// Initialize Redis client (using Upstash or similar)
const redis = Redis.fromEnv();

export interface CachedAnalysisResult {
  results: any[];
  metadata: any;
  timestamp: number;
  expiresAt: number;
}

export async function getCachedImageAnalysis(
  imageUrl: string,
  regions: any[]
): Promise<CachedAnalysisResult | null> {
  // Generate a stable cache key from image URL and regions
  const key = generateCacheKey(imageUrl, regions);
  
  try {
    const cached = await redis.get<CachedAnalysisResult>(key);
    
    if (cached && Date.now() < cached.expiresAt) {
      return cached;
    }
    
    return null;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

export async function cacheImageAnalysis(
  imageUrl: string,
  regions: any[],
  results: any[],
  metadata: any,
  ttlSeconds = 86400 // 24 hours by default
): Promise<boolean> {
  const key = generateCacheKey(imageUrl, regions);
  const now = Date.now();
  
  const cacheData: CachedAnalysisResult = {
    results,
    metadata,
    timestamp: now,
    expiresAt: now + (ttlSeconds * 1000)
  };
  
  try {
    await redis.set(key, cacheData, { ex: ttlSeconds });
    return true;
  } catch (error) {
    console.error('Cache storage error:', error);
    return false;
  }
}

function generateCacheKey(imageUrl: string, regions: any[]): string {
  // Create a deterministic representation of regions
  const regionsStr = regions
    .map(r => `${r.id}-${r.x.toFixed(4)}-${r.y.toFixed(4)}-${r.width.toFixed(4)}-${r.height.toFixed(4)}`)
    .sort()
    .join('|');
  
  // Combined key with image URL
  return `img-analysis:${encodeURIComponent(imageUrl)}:${regionsStr}`;
}

export function invalidateImageCache(imageUrl: string): void {
  // This would delete all cache entries for this image
  // You'd need to implement a pattern-based deletion in Redis
  revalidatePath(`/api/image-analysis?url=${encodeURIComponent(imageUrl)}`);
}
```

## 2. Pre-Calculate Analysis for Static Content

### Create a Build-Time Analysis Script

```typescript
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import glob from 'glob-promise';

import { calculatePerceptualLuminance, calculateColorVariance } from '../src/app/(site)/utils/colorUtils';

async function analyzeStaticImages() {
  // Get all images from the public directory
  const imagePaths = await glob('public/**/*.{jpg,jpeg,png,webp}');
  
  // Create output directory for analysis results
  const outputDir = path.join(process.cwd(), 'src/data/image-analysis');
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log(`Analyzing ${imagePaths.length} static images...`);
  
  for (const imagePath of imagePaths) {
    try {
      // Get image metadata
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const { width, height } = metadata;
      
      if (!width || !height) {
        console.warn(`Skipping ${imagePath}: Could not determine dimensions`);
        continue;
      }
      
      // Generate analysis regions - typical text positions
      // Hero: top left, center, bottom center, etc.
      const regions = [
        { id: 'top-left', x: 0.05, y: 0.05, width: 0.4, height: 0.2 },
        { id: 'top-center', x: 0.3, y: 0.05, width: 0.4, height: 0.2 },
        { id: 'top-right', x: 0.55, y: 0.05, width: 0.4, height: 0.2 },
        { id: 'center', x: 0.25, y: 0.4, width: 0.5, height: 0.2 },
        { id: 'bottom-left', x: 0.05, y: 0.75, width: 0.4, height: 0.2 },
        { id: 'bottom-center', x: 0.3, y: 0.75, width: 0.4, height: 0.2 },
        { id: 'bottom-right', x: 0.55, y: 0.75, width: 0.4, height: 0.2 },
        { id: 'full', x: 0, y: 0, width: 1, height: 1 }
      ];
      
      // Analyze each region
      const analysisResults = [];
      
      for (const region of regions) {
        const { id, x, y, width: regionWidth, height: regionHeight } = region;
        
        // Extract region pixels
        const regionBuffer = await image
          .extract({
            left: Math.floor(x * width),
            top: Math.floor(y * height),
            width: Math.ceil(regionWidth * width),
            height: Math.ceil(regionHeight * height)
          })
          .raw()
          .toBuffer();
        
        // Process pixel data (similar to API route)
        // ... (calculate averages, luminance, etc.)
        
        // Add to results
        analysisResults.push({
          id,
          // ... analysis data
        });
      }
      
      // Generate relative path for output file
      const relativeImagePath = imagePath.replace('public/', '');
      const outputFileName = relativeImagePath
        .replace(/\//g, '-')
        .replace(/\.(jpg|jpeg|png|webp)$/i, '.json');
      
      // Write analysis to JSON file
      await fs.writeFile(
        path.join(outputDir, outputFileName),
        JSON.stringify({
          path: relativeImagePath,
          url: `/${relativeImagePath}`,
          width,
          height,
          regions: analysisResults,
          timestamp: Date.now()
        }, null, 2)
      );
      
      console.log(`Analyzed: ${relativeImagePath}`);
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error);
    }
  }
  
  console.log('Static image analysis complete!');
}

analyzeStaticImages().catch(console.error);
```

### Add Build Script to package.json

```json
{
  "scripts": {
    "analyze-images": "ts-node --project tsconfig.node.json scripts/analyze-static-images.ts",
    "build": "npm run analyze-images && next build"
  }
}
```

## 3. Create Server Components for Text Overlays

### Create a Server Component for Image Analysis

```tsx
import { cache } from 'react';
import fs from 'fs/promises';
import path from 'path';

// Define types
interface ImageRegionAnalysis {
  id: string;
  avgColor: number[];
  avgLuminance: number;
  colorVariance: number;
  recommendedTextColor: 'black' | 'white';
  isBorderline: boolean;
  hasHighVariance: boolean;
  contrastRatio: number;
}

interface ImageAnalysisData {
  path: string;
  url: string;
  width: number;
  height: number;
  regions: ImageRegionAnalysis[];
  timestamp: number;
}

// Cache the image analysis data fetch
const getImageAnalysis = cache(async (imagePath: string): Promise<ImageAnalysisData | null> => {
  try {
    // For static/local images, try to get pre-computed analysis
    if (imagePath.startsWith('/')) {
      const relativePath = imagePath.substring(1).replace(/\//g, '-');
      const analysisPath = path.join(
        process.cwd(),
        'src/data/image-analysis',
        `${relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.json')}`
      );
      
      try {
        const data = await fs.readFile(analysisPath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        console.warn(`No pre-computed analysis found for ${imagePath}`);
        // Fall through to API-based analysis
      }
    }
    
    // For remote/CMS images or when pre-computed analysis is missing
    // We make a server-side request to our analysis API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/image-analysis`;
    
    // Default regions to analyze 
    const regions = [
      { id: 'top', x: 0, y: 0, width: 1, height: 0.33 },
      { id: 'middle', x: 0, y: 0.33, width: 1, height: 0.34 },
      { id: 'bottom', x: 0, y: 0.67, width: 1, height: 0.33 },
      { id: 'full', x: 0, y: 0, width: 1, height: 1 }
    ];
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: imagePath, regions }),
      next: { revalidate: 3600 } // Revalidate hourly
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const { results, metadata } = await response.json();
    
    return {
      path: imagePath,
      url: imagePath,
      width: metadata.originalWidth,
      height: metadata.originalHeight,
      regions: results,
      timestamp: metadata.timestamp
    };
  } catch (error) {
    console.error(`Error fetching image analysis for ${imagePath}:`, error);
    return null;
  }
});

export { getImageAnalysis };
export type { ImageRegionAnalysis, ImageAnalysisData };
```

### Create a Server Component for Image with Text

```tsx
import { getImageAnalysis, type ImageRegionAnalysis } from './ImageAnalysisProvider';
import { AdaptiveTextClient } from '../client/AdaptiveTextClient';
import Image from 'next/image';

interface ImageWithTextSSRProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  description?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}

export async function ImageWithTextSSR({
  imageUrl,
  title,
  subtitle,
  description,
  alt = '',
  priority = false,
  className = ''
}: ImageWithTextSSRProps) {
  // Get pre-analyzed image data on the server
  const analysisData = await getImageAnalysis(imageUrl);
  
  // Default analysis if server analysis fails
  const defaultAnalysis = {
    recommendedTextColor: 'white',
    isBorderline: false,
    hasHighVariance: true,
    contrastRatio: 4.5
  };
  
  // Select appropriate regions for each text element
  let titleAnalysis: Partial<ImageRegionAnalysis> = defaultAnalysis;
  let subtitleAnalysis: Partial<ImageRegionAnalysis> = defaultAnalysis;
  let descriptionAnalysis: Partial<ImageRegionAnalysis> = defaultAnalysis;
  
  if (analysisData) {
    // Use bottom region for title/subtitle/description as they're commonly at bottom
    const bottomRegion = analysisData.regions.find(r => r.id === 'bottom');
    const fullRegion = analysisData.regions.find(r => r.id === 'full');
    
    if (bottomRegion) {
      titleAnalysis = bottomRegion;
      subtitleAnalysis = bottomRegion;
      descriptionAnalysis = bottomRegion;
    } else if (fullRegion) {
      titleAnalysis = fullRegion;
      subtitleAnalysis = fullRegion;
      descriptionAnalysis = fullRegion;
    }
  }
  
  return (
    <div className={`relative ${className}`}>
      <Image 
        src={imageUrl} 
        alt={alt}
        width={analysisData?.width || 1200}
        height={analysisData?.height || 800}
        className="w-full h-full object-cover"
        priority={priority}
      />
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <AdaptiveTextClient 
              analysis={titleAnalysis}
              fallbackColor="white"
              enableTextShadow={true}
            >
              {title}
            </AdaptiveTextClient>
          </h2>
        )}
        
        {subtitle && (
          <h3 className="text-xl md:text-2xl mb-2">
            <AdaptiveTextClient
              analysis={subtitleAnalysis}
              fallbackColor="white"
              enableBackgroundFallback={true}
            >
              {subtitle}
            </AdaptiveTextClient>
          </h3>
        )}
        
        {description && (
          <p className="text-base md:text-lg max-w-prose">
            <AdaptiveTextClient
              analysis={descriptionAnalysis}
              fallbackColor="white"
            >
              {description}
            </AdaptiveTextClient>
          </p>
        )}
      </div>
    </div>
  );
}
```

### Create a Client Component for Adaptive Text

```tsx
'use client';

import { type ImageRegionAnalysis } from '../server/ImageAnalysisProvider';

interface AdaptiveTextClientProps {
  children: React.ReactNode;
  analysis: Partial<ImageRegionAnalysis>;
  fallbackColor?: 'black' | 'white' | 'auto';
  enableTextShadow?: boolean;
  enableBackgroundFallback?: boolean;
  className?: string;
}

export function AdaptiveTextClient({
  children,
  analysis,
  fallbackColor = 'auto',
  enableTextShadow = true,
  enableBackgroundFallback = true,
  className = ''
}: AdaptiveTextClientProps) {
  // Get color from analysis or use fallback
  let textColor = 'inherit';
  if (fallbackColor === 'black') textColor = 'black';
  if (fallbackColor === 'white') textColor = 'white';
  
  // Use server-provided analysis if available
  const recommendedColor = analysis?.recommendedTextColor || (fallbackColor !== 'auto' ? fallbackColor : 'white');
  const isBorderline = analysis?.isBorderline || false;
  const hasHighVariance = analysis?.hasHighVariance || false;
  
  // Determine style based on analysis
  let textStyle: React.CSSProperties = { color: recommendedColor };
  
  if ((isBorderline || hasHighVariance) && (enableTextShadow || enableBackgroundFallback)) {
    if (hasHighVariance && enableTextShadow) {
      // Use text shadow for complex backgrounds
      textStyle = {
        color: recommendedColor,
        textShadow: recommendedColor === 'white' 
          ? '0 0 5px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.9)' 
          : '0 0 5px rgba(255,255,255,0.8), 0 0 3px rgba(255,255,255,0.9)'
      };
    } else if (isBorderline && enableBackgroundFallback) {
      // Use semi-transparent background for borderline cases
      textStyle = {
        color: recommendedColor,
        backgroundColor: recommendedColor === 'white' 
          ? 'rgba(0,0,0,0.4)' 
          : 'rgba(255,255,255,0.4)',
        padding: '0.2em 0.5em',
        borderRadius: '3px',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone'
      };
    }
  }
  
  return (
    <span className={className} style={textStyle}>
      {children}
    </span>
  );
}
```

## 4. Create Fallback Client-Side Analysis for Dynamic Content

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { calculatePerceptualLuminance, calculateColorVariance } from '../utils/colorUtils';

interface ClientAnalysisOptions {
  imageUrl: string;
  elementId: string;
  enabled?: boolean;
}

export function useClientSideImageAnalysis({
  imageUrl,
  elementId,
  enabled = true
}: ClientAnalysisOptions) {
  const [analysis, setAnalysis] = useState({
    recommendedTextColor: 'white' as 'black' | 'white',
    isBorderline: false,
    hasHighVariance: false,
    contrastRatio: 4.5
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (!enabled || !imageUrl || !elementId) return;
    
    // Check if we're running in the browser
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(elementId);
    if (!element) {
      setError(new Error(`Element with ID ${elementId} not found`));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Create canvas if needed
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Get element position relative to image
        const elementRect = element.getBoundingClientRect();
        // Find image element
        let imgElement: HTMLImageElement | null = null;
        document.querySelectorAll('img').forEach(img => {
          if (img.src.includes(imageUrl)) {
            imgElement = img;
          }
        });
        
        if (!imgElement) {
          throw new Error('Could not find image element');
        }
        
        const imgRect = imgElement.getBoundingClientRect();
        
        // Calculate relative coordinates
        const relX = (elementRect.left - imgRect.left) / imgRect.width;
        const relY = (elementRect.top - imgRect.top) / imgRect.height;
        const relWidth = elementRect.width / imgRect.width;
        const relHeight = elementRect.height / imgRect.height;
        
        // Sample pixels (simplified from full implementation)
        const imgX = Math.max(0, Math.min(Math.floor(relX * img.width), img.width - 1));
        const imgY = Math.max(0, Math.min(Math.floor(relY * img.height), img.height - 1));
        const sampleWidth = Math.max(1, Math.min(Math.ceil(relWidth * img.width), img.width - imgX));
        const sampleHeight = Math.max(1, Math.min(Math.ceil(relHeight * img.height), img.height - imgY));
        
        // Get pixel data
        const pixelData = ctx.getImageData(imgX, imgY, sampleWidth, sampleHeight).data;
        
        // Process pixels
        const pixels = [];
        for (let i = 0; i < pixelData.length; i += 4) {
          pixels.push([
            pixelData[i],     // R
            pixelData[i + 1], // G
            pixelData[i + 2]  // B
          ]);
        }
        
        // Calculate metrics
        const avgColor = [
          Math.round(pixels.reduce((sum, [r]) => sum + r, 0) / pixels.length),
          Math.round(pixels.reduce((sum, [, g]) => sum + g, 0) / pixels.length),
          Math.round(pixels.reduce((sum, [, , b]) => sum + b, 0) / pixels.length)
        ];
        
        const luminance = calculatePerceptualLuminance(avgColor as [number, number, number]);
        const variance = calculateColorVariance(pixels);
        
        // Set analysis results
        setAnalysis({
          recommendedTextColor: luminance > 0.5 ? 'black' : 'white',
          isBorderline: luminance > 0.4 && luminance < 0.6,
          hasHighVariance: variance > 0.25,
          contrastRatio: luminance > 0.5 
            ? (luminance + 0.05) / 0.05  // Black text contrast
            : 1.05 / (luminance + 0.05)  // White text contrast
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    img.onerror = () => {
      setError(new Error(`Failed to load image: ${imageUrl}`));
      setIsLoading(false);
    };
    
    img.src = imageUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, elementId, enabled]);
  
  return { analysis, isLoading, error };
}
```

## 5. Create Dynamic Text Component with Hydration

```tsx
'use client';

import { useId, useState, useEffect } from 'react';
import { useClientSideImageAnalysis } from '../../hooks/useClientSideImageAnalysis';
import { AdaptiveTextClient } from './AdaptiveTextClient';

interface DynamicAdaptiveTextProps {
  children: React.ReactNode;
  imageUrl: string;
  serverAnalysis?: {
    recommendedTextColor: 'black' | 'white';
    isBorderline: boolean;
    hasHighVariance: boolean;
  };
  fallbackColor?: 'black' | 'white';
  enableTextShadow?: boolean;
  enableBackgroundFallback?: boolean;
  className?: string;
}

export function DynamicAdaptiveText({
  children,
  imageUrl,
  serverAnalysis,
  fallbackColor = 'white',
  enableTextShadow = true,
  enableBackgroundFallback = true,
  className = ''
}: DynamicAdaptiveTextProps) {
  const elementId = useId();
  const [elementMounted, setElementMounted] = useState(false);
  
  // Use client-side analysis as fallback when server analysis is not available
  const { analysis: clientAnalysis } = useClientSideImageAnalysis({
    imageUrl,
    elementId: `adaptive-text-${elementId}`,
    enabled: !serverAnalysis && elementMounted
  });
  
  // Use server analysis if available, else client analysis
  const analysis = serverAnalysis || clientAnalysis;
  
  // Mark element as mounted after first render
  useEffect(() => {
    setElementMounted(true);
  }, []);
  
  return (
    <span id={`adaptive-text-${elementId}`}>
      <AdaptiveTextClient
        analysis={analysis}
        fallbackColor={fallbackColor}
        enableTextShadow={enableTextShadow}
        enableBackgroundFallback={enableBackgroundFallback}
        className={className}
      >
        {children}
      </AdaptiveTextClient>
    </span>
  );
}
```

## 6. Update Page Components to Use SSR Analysis

```tsx
import { ImageWithTextSSR } from './server/ImageWithTextSSR';

interface HeroSectionProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export default async function HeroSection({ 
  imageUrl, 
  title, 
  subtitle 
}: HeroSectionProps) {
  return (
    <section className="w-full h-[70vh] min-h-[500px]">
      <ImageWithTextSSR
        imageUrl={imageUrl}
        title={title}
        subtitle={subtitle}
        priority={true}
        alt={title}
        className="w-full h-full"
      />
    </section>
  );
}
```

## 7. Performance Optimizations

### Add Sharp to Next.js Config

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },
  // Configure output for maximum performance
  output: 'standalone',
  // Add image analysis dependencies to standalone output
  experimental: {
    outputFileTracingIncludes: {
      '/api/image-analysis': ['./node_modules/sharp/**/*'],
    },
  }
}

module.exports = nextConfig
```

### Add Memory Cache for API Requests

```typescript
import { LRUCache } from 'lru-cache';

// In-memory cache
const analysisCache = new LRUCache<string, any>({
  max: 500, // Maximum 500 items in cache
  ttl: 1000 * 60 * 60 * 24, // 24 hour TTL
});

export function getFromCache(key: string): any | undefined {
  return analysisCache.get(key);
}

export function setInCache(key: string, value: any): void {
  analysisCache.set(key, value);
}

export function generateCacheKey(imageUrl: string, regions: any[]): string {
  // Create a deterministic representation of regions
  const regionsStr = regions
    .map(r => `${r.id}-${r.x.toFixed(4)}-${r.y.toFixed(4)}-${r.width.toFixed(4)}-${r.height.toFixed(4)}`)
    .sort()
    .join('|');
  
  // Combined key with image URL
  return `${imageUrl}:${regionsStr}`;
}
```

## 8. Debug View for Server-Side Accessibility

```tsx
import fs from 'fs/promises';
import path from 'path';
import glob from 'glob-promise';

export default async function AccessibilityReportPage() {
  // Gather all analysis JSON files
  const analysisDir = path.join(process.cwd(), 'src/data/image-analysis');
  const jsonFiles = await glob('*.json', { cwd: analysisDir });
  
  // Read and parse each file
  const imageReports = await Promise.all(
    jsonFiles.map(async (file) => {
      const content = await fs.readFile(path.join(analysisDir, file), 'utf-8');
      return JSON.parse(content);
    })
  );
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Image Accessibility Report</h1>
      
      {imageReports.map((report, index) => (
        <div key={index} className="mb-12 border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <img 
                src={report.url} 
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {report.path}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {report.width}×{report.height} pixels
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.regions.map((region: any) => (
                  <div 
                    key={region.id} 
                    className="border rounded p-3"
                  >
                    <h3 className="font-medium mb-2">Region: {region.id}</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border" 
                        style={{ backgroundColor: `rgb(${region.avgColor[0]}, ${region.avgColor[1]}, ${region.avgColor[2]})` }}
                      ></div>
                      <span>Avg Color: rgb({region.avgColor.join(', ')})</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Luminance: {region.avgLuminance.toFixed(2)}</div>
                      <div>Variance: {region.colorVariance.toFixed(2)}</div>
                      <div>Recommended: {region.recommendedTextColor}</div>
                      <div>
                        Contrast: 
                        <span className={
                          region.contrastRatio >= 4.5 
                            ? 'text-green-600 font-medium' 
                            : region.contrastRatio >= 3
                              ? 'text-yellow-600 font-medium'
                              : 'text-red-600 font-medium'
                        }>
                          {' '}{region.contrastRatio.toFixed(1)}:1
                        </span>
                      </div>
                      <div>{region.isBorderline ? '⚠️ Borderline' : '✓ Clear'}</div>
                      <div>{region.hasHighVariance ? '⚠️ High Variance' : '✓ Uniform'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Benefits of Server-Side Processing

1. **Reduced Client-Side Computation**:
   - Heavy image processing happens on the server
   - Client receives pre-calculated analysis data
   - Minimal JavaScript needed for rendering optimal text

2. **Improved Page Load Performance**:
   - No client-side image processing delay
   - No layout shifts from text color changes
   - Initial HTML includes correct text colors

3. **Better SEO and Accessibility**:
   - Server-rendered HTML has proper contrast
   - Search engines see accessible content
   - Works even with JavaScript disabled

4. **Caching at Multiple Levels**:
   - Build-time analysis for static images
   - Server-side caching for dynamic images
   - CDN caching of analysis results

5. **Accurate Results with Server Tools**:
   - Server has access to better image processing libraries (Sharp)
   - No browser limitations on canvas size/performance
   - Consistent results across all devices

This server-focused approach gives you the best of both worlds: the performance and SEO benefits of server rendering with the adaptive text styling that enhances readability across different image backgrounds.