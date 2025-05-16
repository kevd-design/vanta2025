'use client'

import { useState, useMemo } from 'react'

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

  // Get exact dimensions from the asset first
  const asset = useMemo(() => {
    if (!logo?.logoForLightBG?.asset) {
      throw new Error('Logo asset is required')
    }
    return logo.logoForLightBG.asset
  }, [logo])

  const dimensions = useMemo(() => {
    if (!asset.metadata?.dimensions) {
      throw new Error('Logo dimensions are required')
    }
    return asset.metadata.dimensions
  }, [asset])

  // Calculate display sizes ONCE
  const { displayWidth, displayHeight } = useMemo(() => {
    const defaultWidth = DIMENSIONS.logo.mobile
    const width = typeof window === 'undefined' 
      ? defaultWidth
      : (screenWidth || DIMENSIONS.screen.defaultWidth) < DIMENSIONS.breakpoint.mobile
        ? DIMENSIONS.logo.mobile 
        : DIMENSIONS.logo.desktop

    return {
      displayWidth: width,
      displayHeight: Math.round(width / dimensions.aspectRatio)
    }
  }, [screenWidth, dimensions.aspectRatio])

  // Generate URL immediately without debounce
  const imageUrl = useMemo(() => {
    if (!logo?.logoForLightBG?.asset) return ''
    
    return generateCachedUrl(
      logo.logoForLightBG.asset,
      displayWidth,
      displayHeight,
      {
        quality: IMAGE_OPTIONS.quality.medium,
        dpr,
        skipRounding: true,
        preserveAspectRatio: true
      }
    )
  }, [logo, displayWidth, displayHeight, dpr, generateCachedUrl])



  if (!imageUrl) return null

   return (
    <div>
      <Image
        src={imageUrl}
        alt={asset.altText ?? "Logo"}
        width={displayWidth}
        height={displayHeight}
        placeholder="blur"
        blurDataURL={asset.metadata?.lqip ?? undefined}
        priority
        className={`object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes={`(min-width: ${DIMENSIONS.breakpoint.mobile}px) ${DIMENSIONS.logo.desktop}px, ${DIMENSIONS.logo.mobile}px`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.error('Failed to load logo')
          setIsLoading(false)
        }}
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