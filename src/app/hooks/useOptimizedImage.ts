import { useState, useCallback, useMemo, useEffect } from 'react'
import { IMAGE_OPTIONS } from '@/app/constants'
import { useBestDpr } from '@/app/hooks/useBestDpr'
import { useUrlCache } from '@/app/hooks/useUrlCache'
import { calculateDimensions } from '@/app/lib/utils/imageDimensions'
import type { UseOptimizedImageProps } from '@/app/lib/types/hooks/imageHooks'

export const useOptimizedImage = ({
  asset,
  hotspot,
  crop,
  width,
  height,
  quality = IMAGE_OPTIONS.quality.medium,
  fit,
  format
}: UseOptimizedImageProps) => {
  const { generateCachedUrl } = useUrlCache()
  const dpr = useBestDpr()
  const [stateUrl, setStateUrl] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Generate initial URL with fixed DPR=1 for consistent SSR
  const initialUrl = useMemo(() => {
    if (!asset) return ''

    const sourceAspectRatio = (asset.metadata?.dimensions?.width || width) / 
                             (asset.metadata?.dimensions?.height || height || 1)

    const dimensions = calculateDimensions(
      width, 
      height || width / sourceAspectRatio, 
      sourceAspectRatio
    )

    // Important: Use fixed DPR=1 for initial render to match SSR
    return generateCachedUrl(asset, dimensions.width, dimensions.height, {
      quality,
      dpr: 1, // Always use DPR=1 for initial render
      hotspot: hotspot ? {
        _type: "sanity.imageHotspot",
        ...hotspot
      } : undefined,
      crop: crop ? {
        _type: "sanity.imageCrop",
        ...crop
      } : undefined,
      fit,
      format
    }) || ''
  }, [asset, width, height, quality, hotspot, crop, generateCachedUrl, fit, format])

  // After hydration, generate URL with actual DPR
  const hydratedUrl = useMemo(() => {
    if (!asset || !hydrated) return ''

    // Use the same exact dimensions calculation for consistency
    const sourceAspectRatio = (asset.metadata?.dimensions?.width || width) / 
                             (asset.metadata?.dimensions?.height || height || 1)

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
      } : undefined,
      fit,
      format
    }) || ''
  }, [asset, width, height, quality, dpr, hotspot, crop, generateCachedUrl, hydrated, fit, format])

  // Only set hydrated in client-side code to avoid hydration mismatch
  useEffect(() => {
    // This effect only runs client-side
    setHydrated(true)
  }, [])

  // Update URL after hydration
  useEffect(() => {
    if (hydrated) {
      setStateUrl(hydratedUrl)
    }
  }, [hydratedUrl, hydrated])

  return {
    url: stateUrl || initialUrl,
    setUrl: setStateUrl,
    generateUrl: useCallback(() => hydrated ? hydratedUrl : initialUrl, [hydrated, hydratedUrl, initialUrl])
  }
}