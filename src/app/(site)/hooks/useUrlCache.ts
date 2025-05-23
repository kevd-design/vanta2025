import { useMemo, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type { Image, ImageAsset, ImageMetadata, Reference } from '@sanity/types'
import type { ImageUrlOptions } from '../../types'
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
  image: Image,
  width: number,
  height: number,
  quality: number,
  dpr: number,
  options?: ImageUrlOptions
) => {
  if (DEBUG) {
    console.log('buildImageUrl params:', { image, width, height, quality, dpr, options });
  }

  // Create a complete image object with hotspot/crop data
  const imageWithHotspot = {
    ...image,
    hotspot: options?.hotspot ? {
      _type: 'sanity.imageHotspot',
      ...options.hotspot
    } : undefined,
    crop: options?.crop ? {
      _type: 'sanity.imageCrop',
      ...options.crop
    } : undefined
  };

  if (DEBUG) {
    console.log('Image with hotspot:', imageWithHotspot);
  }

  // Pass complete image object to urlFor
  return urlFor(imageWithHotspot)
    .width(width)
    .height(height)
    .quality(quality)
    .dpr(dpr)
    .fit('crop')
    .auto('format')
    .url();
};



const getAspectRatio = (image: Image, width: number, height: number) => {
  const assetMetadata = ((image.asset as Reference) as unknown as ImageAsset)?.metadata as ImageMetadata
  return assetMetadata?.dimensions?.aspectRatio || 
    (assetMetadata?.dimensions?.width || width) / (assetMetadata?.dimensions?.height || height)
}

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
  image: Image,
  width: number,
  height: number,
  options?: ImageUrlOptions
) => {
  if (!image) return '';

  return buildImageUrl(
    image,
    width,
    height,
    options?.quality ?? IMAGE_OPTIONS.quality.medium,
    options?.dpr ?? 1,
    options
  );
}, []);

    const generateCachedUrl = useCallback((
    asset: Image,
    width: number,
    height: number,
    options?: ImageUrlOptions
  ) => {


    if (!IS_DEVELOPMENT || !urlCache) {
      return generateDirectUrl(asset, width, height, options);
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

    const newUrl = generateDirectUrl(asset, finalWidth, finalHeight, options);
    logCacheMiss(cacheKey, newUrl, finalWidth, finalHeight, focalX, focalY);
    urlCache.set(cacheKey, newUrl);
    return newUrl;
  }, [urlCache, generateDirectUrl]); 

  return { generateCachedUrl, isCacheEnabled: IS_DEVELOPMENT };
}