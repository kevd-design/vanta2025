import { useState, useCallback } from 'react'
import { useUrlCache } from './useUrlCache'
import { useBestDpr } from './useBestDpr'
import { IMAGE_OPTIONS, getNearestBreakpoint } from '../constants'
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

    const bestWidth = getNearestBreakpoint(width)
    const adjustedWidth = Math.round(bestWidth * dpr)
    

    return generateCachedUrl(asset, adjustedWidth, height, {
      quality,
      dpr,
      hotspot: hotspot ? { x: hotspot.x, y: hotspot.y } : undefined,
      crop: crop ? {
        bottom: crop.bottom,
        top: crop.top,
        left: crop.left,
        right: crop.right
      } : undefined
    })
  }, [asset, width, height, quality, dpr, hotspot, crop, generateCachedUrl])

  return {
    url: optimizedUrl,
    generateUrl,
    setUrl: setOptimizedUrl
  }
}