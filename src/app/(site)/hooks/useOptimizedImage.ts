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
  const [hydrated, setHydrated] = useState(false)

  // Generate initial URL with DEFAULT_DPR=1 for consistent SSR
  const initialUrl = useMemo(() => {
    if (!asset) return null

    const sourceAspectRatio = (asset.metadata?.dimensions?.width || width) / 
                             (asset.metadata?.dimensions?.height || height)

    const dimensions = calculateDimensions(
      width, 
      height || width / sourceAspectRatio, 
      sourceAspectRatio
    )

    // Important: Use DEFAULT_DPR=1 for initial render to match SSR
    return generateCachedUrl(asset, dimensions.width, dimensions.height, {
      quality,
      dpr: 1, // Use fixed DPR=1 for initial render
      hotspot: hotspot ? {
        _type: "sanity.imageHotspot",
        ...hotspot
      } : undefined,
      crop: crop ? {
        _type: "sanity.imageCrop",
        ...crop
      } : undefined
    })
  }, [asset, width, height, quality, hotspot, crop, generateCachedUrl])

  // After hydration, generate URL with actual DPR
  const hydratedUrl = useMemo(() => {
    if (!asset || !hydrated) return null

    const sourceAspectRatio = (asset.metadata?.dimensions?.width || width) / 
                             (asset.metadata?.dimensions?.height || height)

    const dimensions = calculateDimensions(
      width, 
      height || width / sourceAspectRatio, 
      sourceAspectRatio
    )

    return generateCachedUrl(asset, dimensions.width, dimensions.height, {
      quality,
      dpr, // Use actual DPR after hydration
      hotspot: hotspot ? {
        _type: "sanity.imageHotspot",
        ...hotspot
      } : undefined,
      crop: crop ? {
        _type: "sanity.imageCrop",
        ...crop
      } : undefined
    })
  }, [asset, width, height, quality, dpr, hotspot, crop, generateCachedUrl, hydrated])

  // Mark as hydrated after first render
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Update URL after hydration
  useEffect(() => {
    if (hydrated) {
      setStateUrl(hydratedUrl)
    }
  }, [hydratedUrl, hydrated])

  return {
    url: stateUrl ?? initialUrl,
    setUrl: setStateUrl,
    generateUrl: useCallback(() => hydrated ? hydratedUrl : initialUrl, [hydrated, hydratedUrl, initialUrl])
  }
}