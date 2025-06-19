import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useHydration } from '@/app/hooks/useHydration'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import type { ImageMetadata } from '@/app/lib/types/image'
import type { UseImageHandlerOptions } from '@/app/lib/types/hooks/imageHooks'

// Define how much dimensions need to change to re-generate image
const DIMENSION_CHANGE_THRESHOLD = 150;

export const useImageHandler = ({
  image,
  width,
  height,
  quality,
  objectFit = 'cover',
  onColorMapChange,
  onImageUrlGenerated,
  isDebugMode = false
}: UseImageHandlerOptions) => {
    const [imageUrl, setImageUrl] = useState<string>('')
    const isHydrated = useHydration()
    
    // Store previous dimensions to detect significant changes
    const prevDimensionsRef = useRef<{ width: number, height: number } | null>(null);
    // Cache the URL to avoid regenerating for small dimension changes
    const cachedUrlRef = useRef<string | null>(null);
    // Track if we've already called onImageUrlGenerated
    const initialCallbackMadeRef = useRef(false);
  
    // Calculate a default height if not provided
    const calculatedHeight = useMemo(() => {
        if (height) return height;
        
        if (image?.asset?.metadata?.dimensions) {
          const { width: sourceWidth, height: sourceHeight } = image.asset.metadata.dimensions;
          if (sourceWidth && sourceHeight) {
              return Math.round(width * (sourceHeight / sourceWidth));
          }
        }
        
        return width;
    }, [height, width, image?.asset?.metadata?.dimensions]);

    // Check if dimensions have changed significantly
    const hasDimensionsChangedSignificantly = useMemo(() => {
      if (!prevDimensionsRef.current) return true;
      
      const widthChange = Math.abs(prevDimensionsRef.current.width - width);
      const heightChange = Math.abs(prevDimensionsRef.current.height - calculatedHeight);
      
      return widthChange > DIMENSION_CHANGE_THRESHOLD || 
             heightChange > DIMENSION_CHANGE_THRESHOLD;
    }, [width, calculatedHeight]);

    // Convert objectFit to fit parameter for useOptimizedImage
    const fitMode = useMemo(() => {
      // Map object-fit CSS values to Sanity image URL fit parameters
      switch(objectFit) {
        case 'contain':
          return 'max';
        case 'cover':
          return 'crop';
        case 'fill':
          return 'fill';
        case 'none':
          return 'clip';
        default:
          return 'crop';
      }
    }, [objectFit]);

    // Only regenerate URL if dimensions have changed significantly
    const shouldRegenerateUrl = hasDimensionsChangedSignificantly || !cachedUrlRef.current;

    // Generate and store URL
    const { url: generatedUrl, generateUrl } = useOptimizedImage({
      asset: shouldRegenerateUrl ? (image?.asset ?? null) : null, // Only pass asset if we need new URL
      hotspot: shouldRegenerateUrl ? (image?.hotspot ?? null) : null,
      crop: shouldRegenerateUrl ? (image?.crop ?? null) : null,
      width: shouldRegenerateUrl ? width : 0, // Only pass dimensions if regenerating
      height: shouldRegenerateUrl ? calculatedHeight : 0,
      quality: shouldRegenerateUrl ? quality : 0,
      fit: fitMode // Pass the converted fit parameter 
    })

    // Handle URL generation
    useEffect(() => {
      // Skip if we don't need to regenerate
      if (!shouldRegenerateUrl && cachedUrlRef.current) {
        setImageUrl(cachedUrlRef.current);
        return;
      }
      
      const url = generateUrl();
      if (url) {
          if (isDebugMode) {
            console.log('Setting image URL:', url, 'dimensions:', { width, height: calculatedHeight });
          }
          
          // Update URL state and cache
          setImageUrl(url);
          cachedUrlRef.current = url;
          
          // Store current dimensions
          prevDimensionsRef.current = { width, height: calculatedHeight };
          
          // Only call the callback if we haven't done so before or dimensions changed significantly
          if (!initialCallbackMadeRef.current || hasDimensionsChangedSignificantly) {
            if (onImageUrlGenerated) {
              onImageUrlGenerated(url);
              initialCallbackMadeRef.current = true;
            }
          }
      }
    }, [generateUrl, shouldRegenerateUrl, isDebugMode, onImageUrlGenerated, 
         width, calculatedHeight, hasDimensionsChangedSignificantly]);

    // Update after hydration only if URL has changed significantly
    useEffect(() => {
      if (isHydrated && generatedUrl && shouldRegenerateUrl) {
          setImageUrl(generatedUrl);
          cachedUrlRef.current = generatedUrl;
          
          // Only call the callback if dimensions changed significantly
          if (onImageUrlGenerated && hasDimensionsChangedSignificantly) {
            onImageUrlGenerated(generatedUrl);
          }
      }
    }, [generatedUrl, isHydrated, onImageUrlGenerated, shouldRegenerateUrl, hasDimensionsChangedSignificantly]);

    // Handle color map callback if provided
    useEffect(() => {
      if (onColorMapChange && imageUrl) {
        const sourceImageInfo: ImageMetadata = {
          sourceUrl: image?.asset?.url || '',
          transformedUrl: imageUrl || '',
          sourceWidth: image?.asset?.metadata?.dimensions?.width || 0,
          sourceHeight: image?.asset?.metadata?.dimensions?.height || 0,
          renderedWidth: width,
          renderedHeight: calculatedHeight,
          cropRect: image?.crop ? {
            x: (image.crop.left || 0) * (image?.asset?.metadata?.dimensions?.width || 0),
            y: (image.crop.top || 0) * (image?.asset?.metadata?.dimensions?.height || 0),
            width: (1 - (image.crop.left || 0) - (image.crop.right || 0)) * 
              (image?.asset?.metadata?.dimensions?.width || 0),
            height: (1 - (image.crop.top || 0) - (image.crop.bottom || 0)) * 
              (image?.asset?.metadata?.dimensions?.height || 0),
          } : undefined,
          dpr: 1
        };
        
        onColorMapChange([], sourceImageInfo);
      }
    }, [onColorMapChange, image, imageUrl, width, calculatedHeight]);

    return {
      // Always use cached URL if available
      imageUrl: cachedUrlRef.current || generatedUrl || '',
      isReady: !!(cachedUrlRef.current || generatedUrl),
      alt: image?.alt || '',
      dimensions: { 
        width: Number(width),
        height: Number(calculatedHeight) 
      },
      metadata: {
        sourceWidth: Number(image?.asset?.metadata?.dimensions?.width || 0),
        sourceHeight: Number(image?.asset?.metadata?.dimensions?.height || 0)
      },
      regenerateImageUrl: useCallback(() => {
        // Force regeneration even if dimensions haven't changed significantly
        const url = generateUrl();
        if (url) {
          setImageUrl(url);
          cachedUrlRef.current = url;
          if (onImageUrlGenerated) {
            onImageUrlGenerated(url);
          }
        }
        return url || '';
      }, [generateUrl, onImageUrlGenerated])
    };
}