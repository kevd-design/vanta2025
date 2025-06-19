import { useMemo, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { IMAGE_OPTIONS } from '@/app/constants/image'
import { BREAKPOINTS } from '@/app/constants/breakpoints'
import { calculateDimensions } from '@/app/lib/utils/imageDimensions'
import type { Image, ImageAsset, ImageMetadata, Reference } from '@sanity/types'
import type { ImageUrlOptions, DimensionTracker } from '@/app/lib/types/hooks/imageHooks'

const dimensionsMap = new Map<string, DimensionTracker>();

const roundToDecimal = (num: number, decimals: number = 2) => 
  Number(Number(num).toFixed(decimals))


const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
// const DEBUG = IS_DEVELOPMENT // Only debug in development
const DEBUG = false // Disable debug logs by default, enable manually if needed

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
) => {
  const roundedWidth = Math.round(width)
  const roundedHeight = Math.round(height)
  const roundedQuality = Math.round(options?.quality ?? 70)
  const roundedDpr = Number((options?.dpr ?? 1).toFixed(1))
  const roundedFocalX = focalX?.toFixed(4) ?? '0.5000'
  const roundedFocalY = focalY?.toFixed(4) ?? '0.5000'
  
  return `w${roundedWidth}h${roundedHeight}q${roundedQuality}d${roundedDpr}fp${roundedFocalX},${roundedFocalY}${
    options?.crop 
      ? `crop${options.crop.top},${options.crop.right},${options.crop.bottom},${options.crop.left}` 
      : ''
  }`
}


const logCacheMiss = (key: string, url: string, width: number, height: number, focalX: number, focalY: number) => {
  void (DEBUG && console.log('Cache miss:', { key, url, dimensions: { width, height }, focalPoint: { x: focalX, y: focalY } }));
};

export function useUrlCache() {

const logCacheHit = useCallback((key: string, url: string, width: number, height: number, focalX: number, focalY: number) => {
  if (!DEBUG) return;

  console.log('Cache hit:', { 
    key, 
    url, 
    dimensions: { width, height }, 
    focalPoint: { x: focalX, y: focalY } 
  });
}, []);

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

    const cacheKey = generateCacheKey(width, height, options);

     // Check if dimensions have changed
    const lastDimensions = dimensionsMap.get(cacheKey);
    
    if (lastDimensions && 
        lastDimensions.width === finalWidth && 
        lastDimensions.height === finalHeight) {
      if (urlCache?.has(cacheKey)) {
        if (DEBUG) {
          logCacheHit(cacheKey, urlCache.get(cacheKey)!, width, height, 
            options?.hotspot?.x ?? 0.5, 
            options?.hotspot?.y ?? 0.5
          );
        }
        return urlCache.get(cacheKey)!;
      }
    }

        // Update dimensions tracker
      dimensionsMap.set(cacheKey, {
        width: finalWidth,
        height: finalHeight
      });


    if (urlCache?.has(cacheKey)) {
      // Only log in debug mode and when actually needed
      if (DEBUG) {
        logCacheHit(cacheKey, urlCache.get(cacheKey)!, width, height, 
          options?.hotspot?.x ?? 0.5, 
          options?.hotspot?.y ?? 0.5
        );
      }
      return urlCache.get(cacheKey)!;
    }

    const newUrl = generateDirectUrl(asset, finalWidth, finalHeight, options);
    logCacheMiss(cacheKey, newUrl, finalWidth, finalHeight, focalX, focalY);
    urlCache.set(cacheKey, newUrl);
    return newUrl;
  }, [urlCache, generateDirectUrl, logCacheHit]); 

  return { generateCachedUrl, isCacheEnabled: IS_DEVELOPMENT };
}