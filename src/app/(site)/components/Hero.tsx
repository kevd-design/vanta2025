'use client'

import { FC, useEffect } from 'react'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { useOptimizedImage } from '../hooks/useOptimizedImage'
import CTA from './common/Cta'
import type { HeroSection } from '../../types'

export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowSize()

  
  const { url: imageUrl, generateUrl, setUrl } = useOptimizedImage({
    asset: image?.asset ?? null,
    hotspot: image?.hotspot ?? undefined,
    width: screenWidth,
    height: screenHeight
  })

  // Generate image URL on mount and screen size changes
  useEffect(() => {
    const url = generateUrl()
    if (url) setUrl(url)
  }, [screenWidth, screenHeight, generateUrl, setUrl])

  return (
    <div className="relative w-full">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full rounded-b-[32px] overflow-hidden">
        {imageUrl && image?.asset && (
          <Image
            src={imageUrl}
            alt={image?.alt ?? ''}
            priority
            className="w-full h-full object-cover"
            style={{
              objectPosition: image?.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : '50% 50%'
            }}
            sizes="100vw"
            placeholder={image?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={image?.metadata?.lqip}
            fill
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {headline && (
          <h1 className="text-5xl md:text-7xl font-bold text-white max-w-3xl">
            {headline}
          </h1>
        )}
        {cta && (
          <div className="mt-8">
            <CTA {...cta} />
          </div>
        )}
      </div>
    </div>
  )
}