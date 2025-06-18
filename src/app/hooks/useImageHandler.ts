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
  objectFit = 'cover',
  onColorMapChange,
  onImageUrlGenerated,
  isDebugMode = false
}: UseImageHandlerOptions) => {
    const [imageUrl, setImageUrl] = useState<string>('')
    const isHydrated = useHydration()
  
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

    // Generate and store URL
    const { url: generatedUrl, generateUrl } = useOptimizedImage({
      asset: image?.asset ?? null,
      hotspot: image?.hotspot ?? null,
      crop: image?.crop ?? null,
      width,
      height: calculatedHeight,
      quality,
      fit: fitMode // Pass the converted fit parameter 
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
    }, [onColorMapChange, image, imageUrl, width, calculatedHeight])

    return {
      imageUrl: generatedUrl || '',
      isReady: !!generatedUrl,
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
        const url = generateUrl();
        if (url) {
          setImageUrl(url);
          if (onImageUrlGenerated) {
            onImageUrlGenerated(url);
          }
        }
        return url || '';
      }, [generateUrl, onImageUrlGenerated])
    };
}