'use client'

import { useState, useMemo, useEffect } from 'react'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { urlFor } from '@/sanity/lib/image'

// Constants
const DIMENSIONS = {
  breakpoint: {
    mobile: 768 // Standard md breakpoint matching Tailwind
  },
  logo: {
    mobile: 149,
    desktop: 215
  }
} as const

interface LogoProps {
  logo: {
    logoForLightBG: {
      asset: {
        altText?: string
        title?: string
        metadata: {
          lqip: string
          dimensions: {
            width: number
            height: number
          }
        }
      }
    }
  }
}

/**
 * Logo component that handles responsive sizing and image optimization
 * 
 * @param logo - Logo data from Sanity containing asset information
 * @returns A responsive Image component with optimal sizing and quality
 * 
 * @example
 * <Logo logo={logoData} />
 */

export const Logo = ({ logo }: LogoProps) => {
    const { width: screenWidth } = useWindowSize()
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [optimizedImageUrl, setOptimizedImageUrl] = useState('')

const aspectRatio = useMemo(() => 
    logo.logoForLightBG.asset.metadata.dimensions.width / 
    logo.logoForLightBG.asset.metadata.dimensions.height,
    [logo.logoForLightBG.asset.metadata.dimensions]
  )

      // Simplified width calculation - only two sizes
    const width = useMemo(() => 
        screenWidth && screenWidth >= DIMENSIONS.breakpoint.mobile 
            ? DIMENSIONS.logo.desktop 
            : DIMENSIONS.logo.mobile,
        [screenWidth]
    )

    // Debounced URL update
    const updateImageUrl = useMemo(
        () =>
            debounce((width: number) => {
                const imageUrl = urlFor(logo.logoForLightBG.asset)
                    .width(Math.round(width * window.devicePixelRatio))
                    .quality(90)
                    .auto('format')
                    .url()
                setOptimizedImageUrl(imageUrl)
            }, 5000),
        [logo.logoForLightBG.asset]
    )

  // Update image URL when screen width changes
  useEffect(() => {
      if (!screenWidth) return
      updateImageUrl(width)

      return () => {
          updateImageUrl.cancel()
      }
  }, [width, screenWidth, updateImageUrl])

  // Initial image URL generation
  useEffect(() => {
      if (!screenWidth) return
      const initialImageUrl = urlFor(logo.logoForLightBG.asset)
          .width(Math.round(screenWidth * window.devicePixelRatio))
          .quality(90)
          .auto('format')
          .url()
      setOptimizedImageUrl(initialImageUrl)
  }, [screenWidth, logo.logoForLightBG.asset, width])


    

  if (!logo?.logoForLightBG) return null
  if (!optimizedImageUrl) return null
  

  const height = Math.round(width / aspectRatio)

  if (hasError) {
    return <div className="w-[149px] h-[33px] bg-gray-200" />
  }

 return (
    <Image
      src={optimizedImageUrl}
      alt={logo.logoForLightBG.asset.altText ?? "Logo"}
      title={logo.logoForLightBG.asset.title ?? "Logo"}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={logo.logoForLightBG.asset.metadata.lqip}
      priority
      className={`object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
      }`}
      sizes={`(min-width: 
        ${DIMENSIONS.breakpoint.mobile}px) 
        ${DIMENSIONS.logo.desktop}px, 
        ${DIMENSIONS.logo.mobile}px`}
      onLoad={() => setIsLoading(false)}
      onError={() => setHasError(true)}
    />
  )
}