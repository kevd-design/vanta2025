import { useState, useCallback, useMemo, useEffect } from 'react'
import { useUrlCache } from './useUrlCache'
import { useBestDpr } from './useBestDpr'
import { IMAGE_OPTIONS } from '../constants'
import type { UseOptimizedImageProps } from '../../types'
import { calculateDimensions } from '../utils/imageDimensions'

export const useOptimizedImage = ({
  asset,
  hotspot,
  crop,
  width,
  height,
  quality = IMAGE_OPTIONS.quality.medium
}: UseOptimizedImageProps) => {
  const { generateCachedUrl } = useUrlCache()
  const dpr = useBestDpr()
  const [stateUrl, setStateUrl] = useState<string | null>(null)

  // Generate URL synchronously using useMemo
  const generatedUrl = useMemo(() => {
    if (!asset) return null

    const sourceAspectRatio = (asset.metadata?.dimensions?.width || width) / 
                            (asset.metadata?.dimensions?.height || height)

    const dimensions = calculateDimensions(
      width, 
      height || width / sourceAspectRatio, 
      sourceAspectRatio
    )

    return generateCachedUrl(asset, dimensions.width, dimensions.height, {
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

  // Keep state in sync with generated URL
  useEffect(() => {
    if (generatedUrl !== stateUrl) {
      setStateUrl(generatedUrl)
    }
  }, [generatedUrl, stateUrl])

  return {
    url: stateUrl ?? generatedUrl,
    setUrl: setStateUrl,
    generateUrl: useCallback(() => generatedUrl, [generatedUrl])
  }
}