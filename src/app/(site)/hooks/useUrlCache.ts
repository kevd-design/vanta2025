import { useMemo, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { ImageAsset } from '@sanity/types'
import { BREAKPOINTS } from '../constants/breakpoints'
import { IMAGE_OPTIONS } from '../constants/image'

interface ImageUrlOptions {
  quality?: number;
  dpr?: number;
  hotspot?: { x: number; y: number };
  crop?: { 
    bottom: number; 
    top: number; 
    left: number; 
    right: number; 
  } | null;
  skipRounding?: boolean;
}

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
  const roundedWidth = Math.round(roundToBoundary(width, boundaries));
  const preservedHeight = Math.round(roundedWidth / aspectRatio);
  return { 
    width: roundedWidth, 
    height: preservedHeight 
  };
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const DEBUG = IS_DEVELOPMENT // Only debug in development

const buildImageUrl = (
  asset: ImageAsset,
  width: number,
  quality: number,
  dpr: number,
  options?: {
    hotspot?: { x: number; y: number }
    crop?: { bottom: number; top: number; left: number; right: number } | null
  }
) => {
  let urlBuilder = urlFor(asset)
    .auto('format')
    .quality(quality)
    .dpr(dpr);

  if (options?.crop) {
    // Convert relative values to absolute pixels
    const originalWidth = asset.metadata?.dimensions?.width || 3600;
    const originalHeight = asset.metadata?.dimensions?.height || 5400;
    
    const rect = {
      left: Math.round(options.crop.left * originalWidth),
      top: Math.round(options.crop.top * originalHeight),
      width: Math.round((1 - (options.crop.left + options.crop.right)) * originalWidth),
      height: Math.round((1 - (options.crop.top + options.crop.bottom)) * originalHeight)
    };

    void (DEBUG && console.log('Crop calculations:', {
      original: { width: originalWidth, height: originalHeight },
      crop: options.crop,
      rect
    }));

    urlBuilder = urlBuilder
      .rect(rect.left, rect.top, rect.width, rect.height)
      .width(width) // Apply width after crop
      .fit('crop');
  } else {
    urlBuilder = urlBuilder.width(width);
  }

  // Apply hotspot only if no crop is specified
  if (options?.hotspot && !options?.crop) {
    urlBuilder = urlBuilder
      .crop('focalpoint')
      .focalPoint(options.hotspot.x, options.hotspot.y);
  }

  return urlBuilder;
};

const getAspectRatio = (asset: ImageAsset, width: number, height: number) => 
  asset.metadata?.dimensions?.aspectRatio || 
  (asset.metadata?.dimensions?.width || width) / (asset.metadata?.dimensions?.height || height);

const generateCacheKey = (
  width: number,
  height: number,
  options?: ImageUrlOptions,
  focalX?: number,
  focalY?: number
) => `w${width}h${height}q${options?.quality ?? 70}d${options?.dpr ?? 1}fp${focalX},${focalY}${
  options?.crop 
    ? `crop${options.crop.top},${options.crop.right},${options.crop.bottom},${options.crop.left}` 
    : ''
}`;

const logCacheHit = (key: string, url: string, width: number, height: number, focalX: number, focalY: number) => {
  void (DEBUG && console.log('Cache hit:', { key, url, dimensions: { width, height }, focalPoint: { x: focalX, y: focalY } }));
};

const logCacheMiss = (key: string, url: string, width: number, height: number, focalX: number, focalY: number) => {
  void (DEBUG && console.log('Cache miss:', { key, url, dimensions: { width, height }, focalPoint: { x: focalX, y: focalY } }));
};

export function useUrlCache() {
  const urlCache = useMemo(() => 
    IS_DEVELOPMENT ? new Map<string, string>() : null, []);

  const generateDirectUrl = useCallback((
    asset: ImageAsset,
    width: number,
    options?: ImageUrlOptions
  ) => {
    if (!asset) return '';

  const urlBuilder = buildImageUrl(
    asset,
    width,
    options?.quality ?? IMAGE_OPTIONS.quality.medium,
    options?.dpr ?? 1,
    { hotspot: options?.hotspot, crop: options?.crop }
  );
    return urlBuilder.url();
  }, []);

    const generateCachedUrl = useCallback((
    asset: ImageAsset,
    width: number,
    height: number,
    options?: ImageUrlOptions
  ) => {
    if (!asset) return '';

    if (!IS_DEVELOPMENT || !urlCache) {
      return generateDirectUrl(asset, width, options);
    }

    const { width: finalWidth, height: finalHeight } = options?.skipRounding
      ? { width, height }
      : calculateDimensions(width, height, getAspectRatio(asset, width, height), BREAKPOINTS);

    const focalX = roundToDecimal(options?.hotspot?.x ?? 0.5);
    const focalY = roundToDecimal(options?.hotspot?.y ?? 0.5);

    const cacheKey = generateCacheKey(finalWidth, finalHeight, options, focalX, focalY);

    if (urlCache.has(cacheKey)) {
      logCacheHit(cacheKey, urlCache.get(cacheKey)!, finalWidth, finalHeight, focalX, focalY);
      return urlCache.get(cacheKey)!;
    }

    const newUrl = generateDirectUrl(asset, finalWidth, options);
    logCacheMiss(cacheKey, newUrl, finalWidth, finalHeight, focalX, focalY);
    urlCache.set(cacheKey, newUrl);
    return newUrl;
  }, [urlCache, generateDirectUrl]); // Add generateDirectUrl as dependency

  return { generateCachedUrl, isCacheEnabled: IS_DEVELOPMENT };
}