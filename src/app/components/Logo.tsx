'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useBestDpr } from '@/app/hooks/useBestDpr'
import { useUrlCache } from '@/app/hooks/useUrlCache'
import { useWindowSize } from '@/app/hooks/useWindowSize'
import { DIMENSIONS, IMAGE_OPTIONS } from '@/app/constants'
import type { LogoProps } from '@/app/lib/types/components/navigation'

export const Logo = ({ 
  logo, 
  debug = false,
  variant = 'light' // Light for dark backgrounds, dark for light backgrounds
}: LogoProps) => {

  // Hooks
  const { width: screenWidth } = useWindowSize()
  const dpr = useBestDpr()
  const { generateCachedUrl } = useUrlCache()

  // State
  const [isLoading, setIsLoading] = useState(true)

  // Select the appropriate logo asset based on variant
  const asset = useMemo(() => {
    // Use logoForLightBG when variant is 'dark' (for light backgrounds)
    // Use logoForDarkBG when variant is 'light' (for dark backgrounds)
    const logoAsset = variant === 'light' 
      ? logo?.logoForDarkBG?.asset 
      : logo?.logoForLightBG?.asset
    
    if (!logoAsset) {
      console.warn('Logo asset is missing for variant:', variant)
      return logo?.logoForLightBG?.asset || logo?.logoForDarkBG?.asset // Fallback to any available logo
    }
    return logoAsset
  }, [logo, variant])

  // Get dimensions from the selected asset
  const dimensions = useMemo(() => {
    if (!asset?.metadata?.dimensions) {
      console.warn('Logo dimensions are missing')
      return { 
        width: DIMENSIONS.logo.desktop,
        height: DIMENSIONS.logo.desktop / 3, // Approximate aspect ratio
        aspectRatio: 3
      }
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

  // Generate URL based on the selected asset
  const imageUrl = useMemo(() => {
    if (!asset) return ''
    
    return generateCachedUrl(
      asset,
      displayWidth,
      displayHeight,
      {
        quality: IMAGE_OPTIONS.quality.medium,
        dpr,
        skipRounding: true,
      }
    )
  }, [asset, displayWidth, displayHeight, dpr, generateCachedUrl])

  if (!imageUrl) return null

  return (
    <Link href="/" className="block">
      <Image
        src={imageUrl}
        alt={asset?.altText ?? "Vanta"}
        width={displayWidth}
        height={displayHeight}
        placeholder="blur"
        blurDataURL={asset?.metadata?.lqip ?? undefined}
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
        <div className="mt-2 p-2 bg-black/70 text-white text-xs font-mono break-all">
          {JSON.stringify({
            variant,
            original: `${dimensions.width}x${dimensions.height}`,
            aspectRatio: dimensions.aspectRatio,
            display: `${displayWidth}x${displayHeight}`,
            dpr,
            imageUrl
          }, null, 2)}
        </div>
      )}
    </Link>
  )
}