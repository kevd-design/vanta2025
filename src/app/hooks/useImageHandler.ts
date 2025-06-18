import { useState, useEffect, useCallback, useMemo } from 'react'
import { useHydration } from '@/app/hooks/useHydration'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import type { ImageMetadata } from '@/app/lib/types/image'
import type { UseImageHandlerOptions } from '@/app/lib/types/hooks/imageHooks'

export const useImageHandler = ({
  image,
  width,
  height,
  quality,
  onColorMapChange,
  onImageUrlGenerated,
  isDebugMode = false
}: UseImageHandlerOptions) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const isHydrated = useHydration()
  
    // Calculate a default height if not provided
    const calculatedHeight = useMemo(() => {
        // If height is provided, use it
        if (height) return height;
        
        // Otherwise, calculate based on image aspect ratio if available
        if (image?.asset?.metadata?.dimensions) {
          const { width: sourceWidth, height: sourceHeight } = image.asset.metadata.dimensions;
          if (sourceWidth && sourceHeight) {
              return Math.round(width * (sourceHeight / sourceWidth));
          }
        }
        
        // Default to a square aspect ratio if no other information is available
        return width;
    }, [height, width, image?.asset?.metadata?.dimensions]);

    // Generate and store URL
    const { url: generatedUrl, generateUrl } = useOptimizedImage({
      asset: image?.asset ?? null,
      hotspot: image?.hotspot ?? null,
      crop: image?.crop ?? null,
      width,
      height: calculatedHeight,
      quality
    })

    // Handle URL generation
    useEffect(() => {
      const url = generateUrl()
      if (url) {
          if (isDebugMode) {
            console.log('Setting image URL:', url)
          }
          setImageUrl(url)
          
          if (onImageUrlGenerated) {
            onImageUrlGenerated(url)
          }
      }
    }, [generateUrl, isDebugMode, onImageUrlGenerated])

    // Update after hydration
    useEffect(() => {
      if (isHydrated && generatedUrl) {
          setImageUrl(generatedUrl)
          
          if (onImageUrlGenerated) {
            onImageUrlGenerated(generatedUrl)
          }
      }
    }, [generatedUrl, isHydrated, onImageUrlGenerated])

    // Handle color map callback if provided
    useEffect(() => {
      // If we have a color map callback but no color map hook,
      // provide a fallback empty data set so components don't break
      if (onColorMapChange && imageUrl) {
        // Create minimal required metadata
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
          dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
        };
        
        // Call with empty color map to prevent errors in components expecting data
        onColorMapChange([], sourceImageInfo);
      }
    }, [onColorMapChange, image, imageUrl, width, calculatedHeight])

    // Debug info
    useEffect(() => {
      if (isDebugMode) {
        console.group('ImageHandler');
        console.log('Dimensions:', { width, height: calculatedHeight });
        console.log('Image asset:', image?.asset);
        console.log('Generated URL:', generatedUrl);
        console.groupEnd();
      }
    }, [width, calculatedHeight, image?.asset, generatedUrl, isDebugMode])

    const regenerateImageUrl = useCallback(() => {
      const url = generateUrl();
      if (url) {
        setImageUrl(url);
        if (onImageUrlGenerated) {
          onImageUrlGenerated(url);
        }
      }
      return url;
    }, [generateUrl, onImageUrlGenerated]);

    return {
      imageUrl: generatedUrl || '', // Return empty string instead of null to prevent type errors
      isReady: !!generatedUrl,
      alt: image?.alt || '',
      dimensions: { width, height: calculatedHeight },
      metadata: {
        sourceWidth: image?.asset?.metadata?.dimensions?.width || 0,
        sourceHeight: image?.asset?.metadata?.dimensions?.height || 0
      },
      regenerateImageUrl
    };
}