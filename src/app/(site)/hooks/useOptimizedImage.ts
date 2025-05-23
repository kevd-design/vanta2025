import { useState, useCallback } from 'react'
import { useUrlCache } from './useUrlCache'
import { useBestDpr } from './useBestDpr'
import { IMAGE_OPTIONS } from '../constants'
import type { UseOptimizedImageProps } from '../../types'

export const useOptimizedImage = ({
  asset,
  hotspot,
  crop,
  width,
  height,
  quality = IMAGE_OPTIONS.quality.medium
}: UseOptimizedImageProps) => {
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null)
  const { generateCachedUrl } = useUrlCache()
  const dpr = useBestDpr()

  const generateUrl = useCallback(() => {
    if (!asset) return null

  // Get source dimensions
  const sourceWidth = asset.metadata?.dimensions?.width || width
  const sourceHeight = asset.metadata?.dimensions?.height || height

  // Calculate target dimensions maintaining aspect ratio
  const targetWidth = Math.min(width, sourceWidth)
  const targetHeight = Math.round((targetWidth / sourceWidth) * sourceHeight)
    

  return generateCachedUrl(asset, targetWidth, targetHeight, {
    quality,
    dpr,
    hotspot: hotspot ? {
      _type: "sanity.imageHotspot",
      ...hotspot
    } : undefined,
    crop: crop ? {
      _type: "sanity.imageCrop",
      ...crop
    } : undefined
  })
  }, [asset, width, height, quality, dpr, hotspot, crop, generateCachedUrl])

  return {
    url: optimizedUrl,
    generateUrl,
    setUrl: setOptimizedUrl
  }
}