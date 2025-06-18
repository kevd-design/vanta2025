'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useOptimizedImage } from '@/app/hooks/useOptimizedImage'
import { DIMENSIONS } from '@/app/constants'
import { useWindowSize } from '@/app/hooks/useWindowSize'
import type { LogoProps } from '@/app/lib/types/components/navigation'

export const Logo = ({ 
  logo, 
  debug = false,
  variant = 'light' // Light for dark backgrounds, dark for light backgrounds
}: LogoProps) => {
  // State
  const [isLoading, setIsLoading] = useState(true)
  const { width: screenWidth } = useWindowSize()
  
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
      return { 
        width: DIMENSIONS.logo.desktop,
        height: DIMENSIONS.logo.desktop / 3, // Approximate aspect ratio
        aspectRatio: 3
      }
    }
    return asset.metadata.dimensions
  }, [asset])

  // Calculate logo dimensions based on screen size
  // Use same calculation for server and client to avoid hydration mismatches
  const logoWidth = useMemo(() => {
    // For server rendering or before hydration, use mobile size as default
    const screenSize = screenWidth || DIMENSIONS.screen.defaultWidth;
    return screenSize < DIMENSIONS.breakpoint.mobile 
      ? DIMENSIONS.logo.mobile
      : DIMENSIONS.logo.desktop;
  }, [screenWidth]);
  
  const logoHeight = useMemo(() => 
    Math.round(logoWidth / dimensions.aspectRatio),
  [logoWidth, dimensions.aspectRatio]);

  // Use the optimized image hook
  const { url: imageUrl } = useOptimizedImage({
    asset: asset || null,
    hotspot: null,
    crop: null,
    width: logoWidth,
    height: logoHeight,
    quality: 90,
    fit: 'max' // Use max fit for logos to preserve aspect ratio
  })

  if (!imageUrl) return null

  return (
    <Link href="/" className="block">
      <Image
        src={imageUrl}
        alt={asset?.altText ?? "Vanta Construction logo"}
        width={logoWidth}
        height={logoHeight}
        placeholder={asset?.metadata?.lqip ? "blur" : "empty"}
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
            display: `${logoWidth}x${logoHeight}`,
            imageUrl
          }, null, 2)}
        </div>
      )}
    </Link>
  )
}