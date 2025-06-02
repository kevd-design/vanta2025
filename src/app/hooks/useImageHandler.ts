import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useHydration } from '@/app/hooks/useHydration'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import { useImageColorMap } from '@/app/hooks/useImageColorMap'
import type { ColorMap } from '@/app/lib/types/colorMap'
import type { ImageMetadata, ImageRenderInfo } from '@/app/lib/types/image'
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
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const isHydrated = useHydration()
    const prevColorMapRef = useRef<string>('')

  
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

    // Define color map options
    const colorMapOptions = useMemo((): ImageRenderInfo => ({
    containerWidth: width,
    containerHeight: calculatedHeight,
    objectFit,
    objectPosition: image?.hotspot 
        ? { x: image.hotspot.x, y: image.hotspot.y }
        : { x: 0.5, y: 0.5 },
    hotspot: image?.hotspot 
        ? {
            x: image.hotspot.x,
            y: image.hotspot.y,
            width: image.hotspot.width ?? 1,
            height: image.hotspot.height ?? 1
        }
        : undefined
    }), [width, calculatedHeight, objectFit, image?.hotspot])

    // Get color map
    const colorMap = useImageColorMap(imageUrl, colorMapOptions)

    // Add equality check to prevent unnecessary updates
    useEffect(() => {
    if (onColorMapChange && colorMap && colorMap.length > 0) {
        // Extract critical information about the source image
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

        // Create a minimal representation of the color map for comparison
        const mapSignature = JSON.stringify(
        colorMap.map(row => row.map(cell => cell.luminance.toFixed(2)))
        );
        
        // Only update if the map has meaningfully changed
        if (mapSignature !== prevColorMapRef.current) {
        prevColorMapRef.current = mapSignature;
        onColorMapChange(colorMap, sourceImageInfo);
        }
    }
    }, [colorMap, onColorMapChange, image, imageUrl, width, calculatedHeight])

    // Debug info
    useEffect(() => {
    if (isDebugMode) {
        console.group('ImageHandler');
        console.log('Dimensions:', { width, height });
        console.log('Image asset:', image?.asset);
        console.log('Generated URL:', generatedUrl);
        console.log('Color map size:', colorMap?.length ?? 0);
        console.groupEnd();
    }
    }, [width, height, image?.asset, generatedUrl, colorMap, isDebugMode])

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

    const processColorMap = useCallback((
        newColorMap: ColorMap, 
        sourceImageInfo: ImageMetadata
        ) => {
        if (onColorMapChange) {
            const mapSignature = JSON.stringify(
            newColorMap.map(row => row.map(cell => cell.luminance.toFixed(2)))
            );
            
            if (mapSignature !== prevColorMapRef.current) {
            prevColorMapRef.current = mapSignature;
            onColorMapChange(newColorMap, sourceImageInfo);
            return true;
            }
        }
        return false;
    }, [onColorMapChange]);

    return {
        imageUrl: generatedUrl || null,
        colorMap,
        isReady: !!generatedUrl,
        alt: image?.alt || '',
        dimensions: { width, height },
        metadata: {
            sourceWidth: image?.asset?.metadata?.dimensions?.width || 0,
            sourceHeight: image?.asset?.metadata?.dimensions?.height || 0
        },
        regenerateImageUrl,
        processColorMap
    };
}