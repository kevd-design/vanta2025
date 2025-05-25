import { FC, useMemo, useEffect, useState } from 'react'
import Image from 'next/image'
import { useOptimizedImage } from '../../hooks/useOptimizedImage'
import { useDebug } from '../../context/DebugContext'
import type { OptimizedImageProps, ImageRenderInfo } from '../../../types'
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
  onColorMapChange
}) => {
  const { isDebugMode } = useDebug()
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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
  const { generateUrl } = useOptimizedImage({
    asset: image?.asset ?? null,
    hotspot: image?.hotspot ?? null,
    crop: image?.crop ?? null,
    width: dimensions.width,
    height: dimensions.height,
    quality
  })
  
  const colorMapOptions = useMemo((): ImageRenderInfo => ({
    containerWidth: dimensions.width,
    containerHeight: dimensions.height,
    objectFit,
    objectPosition: image?.hotspot 
      ? { x: image.hotspot.x, y: image.hotspot.y }
      : { x: 0.5, y: 0.5 },
    hotspot: image?.hotspot ?? null
  }), [dimensions, objectFit, image?.hotspot])

  const colorMap = useImageColorMap(imageUrl, colorMapOptions)

    useEffect(() => {
    if (onColorMapChange && colorMap) {
      onColorMapChange(colorMap)
    }
  }, [colorMap, onColorMapChange])

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
  }, [generateUrl, isDebugMode])

  if (!imageUrl || !image?.asset) {
    if (isDebugMode) {
      console.warn('Missing image URL or asset:', { imageUrl, asset: image?.asset })
    }
    return null
  }

  
  return (
    <div className={`relative ${isDebugMode ? 'outline outline-2 outline-red-500' : ''}`}>
      <Image
        src={imageUrl}
        width={dimensions.width}
        height={dimensions.height}
        className={`${className} object-${objectFit}`}
        loading={priority ? 'eager' : 'lazy'}
        alt={image?.alt ?? ''}
      />
      
    </div>
  )
}