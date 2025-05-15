import { useMemo, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { ImageAsset } from '@sanity/types'
import { BREAKPOINTS } from '../constants/breakpoints'
import { IMAGE_OPTIONS } from '../constants/image'

const roundToDecimal = (num: number, decimals: number = 2) => 
  Number(Number(num).toFixed(decimals))

const roundToBoundary = (value: number, boundaries: readonly number[]) => {
  return boundaries.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  )
}

const calculateDimensions = (
  width: number, 
  height: number, 
  aspectRatio: number,
  boundaries: readonly number[]
) => {
  const roundedWidth = roundToBoundary(width, boundaries);
  // Calculate height based on preserved aspect ratio
  const preservedHeight = Math.round(roundedWidth / aspectRatio);
  return { width: roundedWidth, height: preservedHeight };
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const DEBUG = IS_DEVELOPMENT // Only debug in development

export function useUrlCache() {
  // Only create cache in development
  const urlCache = useMemo(() => 
    IS_DEVELOPMENT ? new Map<string, string>() : null, [])

  // Generate cached URL
  const generateCachedUrl = useCallback((
    asset: ImageAsset,
    width: number,
    height: number,
    options?: {
      quality?: number
      dpr?: number
      hotspot?: { x: number; y: number }
      skipRounding?: boolean
      preserveAspectRatio?: boolean
    }
  ) => {
    if (!asset) return '';

    const originalAspectRatio = asset.metadata?.dimensions?.aspectRatio || 
      (asset.metadata?.dimensions?.width || width) / (asset.metadata?.dimensions?.height || height);

    if (!IS_DEVELOPMENT || !urlCache) {
      return generateDirectUrl(asset, width, height, options);
    }

  // Only round dimensions if not explicitly skipped
  const { width: finalWidth, height: finalHeight } = options?.skipRounding
    ? { width, height }
    : calculateDimensions(width, height, originalAspectRatio, BREAKPOINTS);
    
    // Round focal point coordinates to 2 decimal places
    const focalX = roundToDecimal(options?.hotspot?.x ?? 0.5)
    const focalY = roundToDecimal(options?.hotspot?.y ?? 0.5)
    
     // Create simplified cache key
    const cacheKey = `w${finalWidth}h${finalHeight}q${options?.quality ?? 70}d${options?.dpr ?? 1}fp${focalX},${focalY}`;

    // Check cache and debug log
    if (urlCache.has(cacheKey)) {
      void (DEBUG && console.log('Cache hit:', {
        key: cacheKey,
        url: urlCache.get(cacheKey),
        dimensions: { width: finalWidth, height: finalHeight },
        focalPoint: { x: focalX, y: focalY }
      }));
      return urlCache.get(cacheKey)!;
    }

    // Generate new URL using rounded values
    let urlBuilder = urlFor(asset)
      .width(finalWidth)  // Use rounded width
      .height(finalHeight)  // Use rounded height
      .fit('clip')
      .quality(options?.quality ?? IMAGE_OPTIONS.quality.medium)
      .dpr(options?.dpr ?? 1)
      .auto('format');

    if (options?.hotspot) {
      urlBuilder = urlBuilder
        .focalPoint(focalX, focalY)  // Use rounded focal points
    }

    const newUrl = urlBuilder.url();
    
    // Debug log cache miss
    void (DEBUG && console.log('Cache miss:', {
      key: cacheKey,
      newUrl,
      dimensions: { width: finalWidth, height: finalHeight },
      focalPoint: { x: focalX, y: focalY }
    }));

    // Cache the new URL
    urlCache.set(cacheKey, newUrl);
    return newUrl;
  }, [urlCache]);

    // Helper function for direct URL generation
  const generateDirectUrl = (
    asset: ImageAsset,
    width: number,
    height: number,
    options?: {
      quality?: number
      dpr?: number
      hotspot?: { x: number; y: number }
      preserveAspectRatio?: boolean
    }
  ) => {
    let urlBuilder = urlFor(asset)
      .width(width)
      .height(height)
      .fit('clip') 
      .quality(options?.quality ?? IMAGE_OPTIONS.quality.medium)
      .dpr(options?.dpr ?? 1)
      .auto('format');

    if (options?.hotspot) {
      urlBuilder = urlBuilder
        .focalPoint(options.hotspot.x, options.hotspot.y)
        .crop('focalpoint');
    }

    return urlBuilder.url();
  }

  return { 
    generateCachedUrl,
    isCacheEnabled: IS_DEVELOPMENT 
  };
}