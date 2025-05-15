import { useMemo, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { ImageAsset } from '@sanity/types'
import { BREAKPOINTS } from '../constants/breakpoints'
import { IMAGE_OPTIONS } from '../constants/image'


const STANDARD_HEIGHTS = [64, 848, 912] as const

const roundToDecimal = (num: number, decimals: number = 2) => 
  Number(Number(num).toFixed(decimals))

const roundToBoundary = (value: number, boundaries: readonly number[]) => {
  return boundaries.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  )
}

const DEBUG = true // Set to false in production;

export function useUrlCache() {
  // Create URL cache
  const urlCache = useMemo(() => new Map<string, string>(), [])

  // Generate cached URL
  const generateCachedUrl = useCallback((
    asset: ImageAsset,
    width: number,
    height: number,
    options?: {
      quality?: number
      dpr?: number
      hotspot?: { x: number; y: number }
    }
  ) => {
    if (!asset) return '';

    // Round dimensions to nearest boundary
    const roundedWidth = roundToBoundary(width, BREAKPOINTS)
    const roundedHeight = roundToBoundary(height, STANDARD_HEIGHTS)
    
    // Round focal point coordinates to 2 decimal places
    const focalX = roundToDecimal(options?.hotspot?.x ?? 0.5)
    const focalY = roundToDecimal(options?.hotspot?.y ?? 0.5)
    
     // Create simplified cache key
    const cacheKey = `w${roundedWidth}h${roundedHeight}q${options?.quality ?? 70}d${options?.dpr ?? 1}fp${focalX},${focalY}`;

    // Check cache and debug log
    if (urlCache.has(cacheKey)) {
      void (DEBUG && console.log('Cache hit:', {
        key: cacheKey,
        url: urlCache.get(cacheKey),
        dimensions: { width: roundedWidth, height: roundedHeight },
        focalPoint: { x: focalX, y: focalY }
      }));
      return urlCache.get(cacheKey)!;
    }

    // Generate new URL using rounded values
    let urlBuilder = urlFor(asset)
      .width(roundedWidth)  // Use rounded width
      .height(roundedHeight)  // Use rounded height
      .fit('crop')
      .quality(options?.quality ?? IMAGE_OPTIONS.quality.medium)
      .dpr(options?.dpr ?? 1)
      .auto('format');

    if (options?.hotspot) {
      urlBuilder = urlBuilder
        .focalPoint(focalX, focalY)  // Use rounded focal points
        .crop('focalpoint')
        .fit('crop');
    }

    const newUrl = urlBuilder.url();
    
    // Debug log cache miss
    void (DEBUG && console.log('Cache miss:', {
      key: cacheKey,
      newUrl,
      dimensions: { width: roundedWidth, height: roundedHeight },
      focalPoint: { x: focalX, y: focalY }
    }));

    // Cache the new URL
    urlCache.set(cacheKey, newUrl);
    return newUrl;
  }, [urlCache]);

  return { generateCachedUrl };
}