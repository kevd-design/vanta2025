import { useState, useCallback } from 'react'
import { useUrlCache } from './useUrlCache'
import { useBestDpr } from './useBestDpr'
import { IMAGE_OPTIONS, getNearestBreakpoint } from '../constants'
import type { UseOptimizedImageProps } from '../../types'

export const useOptimizedImage = ({
  asset,
  hotspot,
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
    return generateCachedUrl(asset, bestWidth, height, {
      quality,
      dpr,
      hotspot: hotspot ? { x: hotspot.x, y: hotspot.y } : undefined
    })
  }, [asset, width, height, quality, dpr, hotspot, generateCachedUrl])

  return {
    url: optimizedUrl,
    generateUrl,
    setUrl: setOptimizedUrl
  }
}