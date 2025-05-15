'use client'

import { useState, useMemo, useEffect } from 'react'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { useBestDpr } from '../hooks/useBestDpr'
import type { LogoProps } from '../../types'
import { useUrlCache } from '../hooks/useUrlCache'
import { DIMENSIONS, IMAGE_OPTIONS } from '../constants'

export const Logo = ({ logo, debug = false }: LogoProps) => {

  // Hooks
  const { width: screenWidth } = useWindowSize()
  const dpr = useBestDpr()
  const { generateCachedUrl } = useUrlCache()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [optimizedImageUrl, setOptimizedImageUrl] = useState('')

  // Memoized values with type assertions
  const asset = useMemo(() => {
    if (!logo?.logoForLightBG?.asset) throw new Error('Logo asset is required')
    return logo.logoForLightBG.asset
  }, [logo])

  const dimensions = useMemo(() => {
    if (!asset.metadata?.dimensions) throw new Error('Logo dimensions are required')
    return asset.metadata.dimensions
  }, [asset])

  // Calculate dimensions
  const displayWidth = useMemo(() => 
    (screenWidth || DIMENSIONS.screen.defaultWidth) < DIMENSIONS.breakpoint.mobile
      ? DIMENSIONS.logo.mobile 
      : DIMENSIONS.logo.desktop,
    [screenWidth]
  )

  const displayHeight = useMemo(() => 
    Math.ceil(displayWidth / dimensions.aspectRatio),
    [displayWidth, dimensions.aspectRatio]
  )


  // URL Generation
const updateImageUrl = useMemo(
    () =>
      debounce(() => {
        if (!asset) return;
        const imageUrl = generateCachedUrl(
          asset,
          displayWidth,
          displayHeight,
          {
            quality: IMAGE_OPTIONS.quality.medium,
            dpr,
            skipRounding: true,
            preserveAspectRatio: true
          }
        );
        setOptimizedImageUrl(imageUrl)
      }, IMAGE_OPTIONS.debounce.wait),
    [asset, displayWidth, displayHeight, dpr, generateCachedUrl]
  )

  useEffect(() => {
    updateImageUrl()
    return () => updateImageUrl.cancel()
  }, [updateImageUrl])

  if (hasError) return <div className="w-[149px] h-[33px] bg-gray-200" />
  if (!optimizedImageUrl) {
  return (
    <div className={`relative min-w-[${displayWidth}px] min-h-[${displayHeight}px] bg-gray-50`}>
      {/* Optional loading skeleton */}
      <div className="absolute inset-0 animate-pulse bg-gray-200" />
    </div>
  )
}

   return (
    <div>
      <Image
        src={optimizedImageUrl}
        alt={asset.altText ?? "Logo"}
        title={asset.title ?? "Logo"}
        width={displayWidth}
        height={displayHeight}
        placeholder="blur"
        blurDataURL={asset.metadata?.lqip}
        priority
        className={`object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes={`(min-width: ${DIMENSIONS.breakpoint.mobile}px) ${DIMENSIONS.logo.desktop}px, ${DIMENSIONS.logo.mobile}px`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      {debug && (
        <div className="mt-2 p-2 bg-black/70 text-white text-xs font-mono">
          <pre>
            {JSON.stringify({
              original: `${dimensions.width}x${dimensions.height}`,
              aspectRatio: dimensions.aspectRatio,
              display: `${displayWidth}x${displayHeight}`,
              dpr
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}