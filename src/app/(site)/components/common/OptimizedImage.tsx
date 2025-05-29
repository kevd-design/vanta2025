import { FC, useMemo, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useOptimizedImage } from '../../hooks/useOptimizedImage'
import { useDebug } from '../../context/DebugContext'
import { useHydration } from '../../hooks/useHydration'
import type { OptimizedImageProps, ImageRenderInfo } from '../../../types'
// Import with an alias to avoid conflict with Sanity's ImageMetadata
import type { ImageMetadata as ColorMapImageMetadata } from '../../../types/colorMap'
import { useImageColorMap } from '../../hooks/useImageColorMap'
import { BREAKPOINTS } from '../../constants'
import { calculateDimensions } from '../../utils/imageDimensions'


export const OptimizedImage: FC<OptimizedImageProps> = ({
  image,
  width,
  height,
  quality,
  className = '',
  priority = false,
  objectFit = 'cover',
  onColorMapChange,
  onImageUrlGenerated
}) => {
  const { isDebugMode } = useDebug()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const isHydrated = useHydration()
  
  // Add ref to track previous color map for comparison
  const prevColorMapRef = useRef<string>('')

  // Calculate dimensions first
  const dimensions = useMemo(() => {
    const sourceAspectRatio = (image?.asset?.metadata?.dimensions?.width || width) / 
                             (image?.asset?.metadata?.dimensions?.height || height || width)
    
    if (isDebugMode) {
      console.group('OptimizedImage Dimension Calculation')
      console.log('Inputs:', { width, height, sourceAspectRatio, metadata: image?.asset?.metadata?.dimensions })
    }
    
    const dims = calculateDimensions(
      width,
      height || width / sourceAspectRatio,
      sourceAspectRatio,
      BREAKPOINTS
    )

    if (isDebugMode) {
      console.log('Calculated Dimensions:', dims)
      console.groupEnd()
    }

    return dims
  }, [width, height, image?.asset?.metadata?.dimensions, isDebugMode])

  // Generate and store URL
  const { url: generatedUrl, generateUrl } = useOptimizedImage({
    asset: image?.asset ?? null,
    hotspot: image?.hotspot ?? null,
    crop: image?.crop ?? null,
    width: dimensions.width,
    height: dimensions.height,
    quality
  })

    // Only update image analysis after hydration
  useEffect(() => {
    if (isHydrated && generatedUrl) {
      setImageUrl(generatedUrl)
      
      if (onImageUrlGenerated) {
        onImageUrlGenerated(generatedUrl)
      }
    }
  }, [generatedUrl, isHydrated, onImageUrlGenerated])
  
  const colorMapOptions = useMemo((): ImageRenderInfo => ({
    containerWidth: dimensions.width,
    containerHeight: dimensions.height,
    objectFit,
    objectPosition: image?.hotspot 
      ? { x: image.hotspot.x, y: image.hotspot.y }
      : { x: 0.5, y: 0.5 },
    hotspot: image?.hotspot 
      ? {
          x: image.hotspot.x,
          y: image.hotspot.y,
          width: image.hotspot.width ?? 1,  // Default to 1 if not provided
          height: image.hotspot.height ?? 1  // Default to 1 if not provided
        }
      : undefined
  }), [dimensions, objectFit, image?.hotspot])

  const colorMap = useImageColorMap(imageUrl, colorMapOptions)
  
  // Add equality check to prevent unnecessary updates
  useEffect(() => {
    if (onColorMapChange && colorMap && colorMap.length > 0) {
      // Extract critical information about the source image
      const sourceImageInfo: ColorMapImageMetadata = {
        sourceUrl: image?.asset?.url || '',
        transformedUrl: imageUrl || '',
        sourceWidth: image?.asset?.metadata?.dimensions?.width || 0,
        sourceHeight: image?.asset?.metadata?.dimensions?.height || 0,
        renderedWidth: dimensions.width,
        renderedHeight: dimensions.height,
        cropRect: image?.crop ? {
          x: (image.crop.left || 0) * (image?.asset?.metadata?.dimensions?.width || 0),
          y: (image.crop.top || 0) * (image?.asset?.metadata?.dimensions?.height || 0),
          width: (1 - (image.crop.left || 0) - (image.crop.right || 0)) * 
            (image?.asset?.metadata?.dimensions?.width || 0),
          height: (1 - (image.crop.top || 0) - (image.crop.bottom || 0)) * 
            (image?.asset?.metadata?.dimensions?.height || 0),
        } : undefined,
        dpr: window.devicePixelRatio || 1
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
  }, [colorMap, onColorMapChange, image, imageUrl, dimensions])

    // Debug the dimensions being used
    useEffect(() => {
    if (isDebugMode) {
      console.group('Color Map Dimensions')
      console.log('Using dimensions:', {
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: dimensions.aspectRatio
      })
      console.log('Color map options:', colorMapOptions)
      console.groupEnd()
    }
  }, [dimensions, colorMapOptions, isDebugMode])
  

  // Always generate URL on mount and when deps change
  useEffect(() => {
    const url = generateUrl()
    if (url) {
      if (isDebugMode) {
        console.log('Setting image URL:', url)
      }
      setImageUrl(url)
    }
    if (onImageUrlGenerated) {
        onImageUrlGenerated(url)
      }
  }, [generateUrl, isDebugMode, onImageUrlGenerated])

  if (!imageUrl || !image?.asset) {
    if (isDebugMode) {
      console.warn('Missing image URL or asset:', { imageUrl, asset: image?.asset })
    }
    return null
  }

  
  return (
    <div className={`relative ${isDebugMode ? 'outline outline-2 outline-red-500' : ''}`}>
      <Image
        src={generatedUrl || ''}  // Use generatedUrl directly, not imageUrl
        width={dimensions.width}
        height={dimensions.height}
        className={`${className} object-${objectFit}`}
        loading={priority ? 'eager' : 'lazy'}
        alt={image?.alt ?? ''}
      />
      
    </div>
  )
}