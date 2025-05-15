'use client'

import { useState, useMemo, useEffect } from 'react'
import { debounce } from 'lodash'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'

import { useBestDpr } from '../hooks/useBestDpr'
import type { LogoType } from '../../types'
import { useUrlCache } from '../hooks/useUrlCache'
import { DIMENSIONS, IMAGE_OPTIONS, getNearestBreakpoint } from '../constants'




// Types
interface LogoProps {
  logo: LogoType
  debug?: boolean
}

export const Logo = ({ logo, debug = false }: LogoProps) => {
  // Hooks
  const { width: screenWidth } = useWindowSize()
  const dpr = useBestDpr()
  const { generateCachedUrl } = useUrlCache()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [optimizedImageUrl, setOptimizedImageUrl] = useState('')

  

  // Memoized Values
  // Memoized Values with internal null checks
  const aspectRatio = useMemo(() => {
    if (!logo?.logoForLightBG?.asset?.metadata?.dimensions) {
      return 1 // Default aspect ratio
    }
    const { width, height } = logo.logoForLightBG.asset.metadata.dimensions
    return width / height
  }, [logo?.logoForLightBG?.asset?.metadata?.dimensions])

  

  const width = useMemo(() => {
    const isMobile = (screenWidth || DIMENSIONS.screen.defaultWidth) < DIMENSIONS.breakpoint.mobile
    return isMobile ? DIMENSIONS.logo.mobile : DIMENSIONS.logo.desktop
  }, [screenWidth])

  const height = useMemo(() => 
    Math.round(width / aspectRatio),
    [width, aspectRatio]
  )

  

  // URL Generation
  const updateImageUrl = useMemo(
    () =>
      debounce((width: number) => {
        if (!logo?.logoForLightBG?.asset) return;
        
        const breakpointWidth = getNearestBreakpoint(width);
        const imageUrl = generateCachedUrl(
          logo.logoForLightBG.asset,
          breakpointWidth,
          Math.round(breakpointWidth / aspectRatio),
          {
            quality: IMAGE_OPTIONS.quality.medium,
            dpr
          }
        );
        setOptimizedImageUrl(imageUrl)
      }, IMAGE_OPTIONS.debounce.wait),
    [logo?.logoForLightBG?.asset, dpr, aspectRatio, generateCachedUrl]
  )

  // Effects
  useEffect(() => {
    if (!width) return
    updateImageUrl(width)
    return () => updateImageUrl.cancel()
  }, [width, updateImageUrl])

  useEffect(() => {
    if (!width) return
    updateImageUrl.flush()
  }, ) // Initial URL generation

  // Guard Clauses
  if (!logo?.logoForLightBG?.asset) return null
  if (!optimizedImageUrl) return null
  if (hasError) {
    return <div className="w-[149px] h-[33px] bg-gray-200" />
  }


  return (
    <div>
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
        sizes={`(min-width: ${DIMENSIONS.breakpoint.mobile}px) ${DIMENSIONS.logo.desktop}px, ${DIMENSIONS.logo.mobile}px`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
      {debug && (
        <div className="mt-2 p-2 bg-black/70 text-white text-xs font-mono rounded break-all w-full max-w-xs">
          <div><b>Logo URL:</b> {optimizedImageUrl}</div>
          <div><b>DPR:</b> {dpr}</div>
          <div><b>Width:</b> {width}px</div>
          <div><b>Height:</b> {height}px</div>
        </div>
      )}
    </div>
  )
}