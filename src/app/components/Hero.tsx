'use client'

import { FC, useRef, useMemo, useState } from 'react'
import Image from 'next/image'
import { useDebug } from '@/debug'
import { HeroBackground } from '@/app/components/HeroBackground'
import { HeroContent } from '@/app/components/HeroContent'
import { ImageContainer } from '@/app/components/common/ImageContainer'
import { useDebugObserver } from '@/debug/hooks/useDebugObserver'
import type { HeroSection } from '@/app/lib/types/components/hero'

export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  const { isDebugMode } = useDebug()
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null)

  const elementRefs = useMemo(() => [
    { ref: headlineRef, label: 'Headline' },
    { ref: ctaRef, label: 'CTA' }
  ], [])
  
  // Use the debug observer to send optimized image URL to debug panel
  useDebugObserver({
    componentId: "hero",
    displayName: "Hero Section",
    image,
    optimizedImageUrl: optimizedImageUrl || undefined, // Pass the optimized URL to the debug observer
    enabled: isDebugMode
  });

  if (!image?.asset) {
    return null; // Or render a fallback/placeholder
  }


  const fallbackContent = (
    <noscript>
      <div className="relative w-full h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px]">
        {image?.asset?.url && (
          <>
            {/* Fallback image */}
            <Image
              src={optimizedImageUrl || image.asset.url}
              alt={image.alt || ''}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient overlay for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
          </>
        )}
        {/* Basic content with safe contrasting colors */}
        <div className="relative z-10 container mx-auto px-4 pt-32">
          {headline && (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              {headline}
            </h1>
          )}
          {cta && (
            <div className="inline-block bg-white text-black px-6 py-3 rounded-lg">
              {cta.linkLabel}
            </div>
          )}
        </div>
      </div>
    </noscript>
  )

  return (
    <>
      <ImageContainer 
        className="relative w-full h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px]"
        isDebugMode={isDebugMode}
        imageId="hero"
        displayName="Hero Background"
        elementRefs={elementRefs}
        image={image}
      >
        {({ dimensions, onColorMapChange, elementColors, setOptimizedImageUrl: containerSetOptimizedImageUrl }) => (
          <>
            <HeroBackground 
              image={image}
              dimensions={dimensions}
              isDebugMode={isDebugMode}
              onColorMapChange={onColorMapChange}
              setOptimizedImageUrl={(url: string) => {
                // Update both the container state and our local state
                containerSetOptimizedImageUrl(url);
                setOptimizedImageUrl(url);
              }}
            />
            <HeroContent
              headline={headline}
              cta={cta}
              headlineRef={headlineRef}
              ctaRef={ctaRef}
              getTextColorClass={(label) => {
                const colorResult = elementColors[label]?.color
                return colorResult === 'background' 
                  ? 'bg-black/50 px-4 py-2 text-white'
                  : colorResult || 'text-white'
              }}
            />
          </>
        )}
      </ImageContainer>
      {/* No-JS version */}
      <div className="no-js-content">
        {fallbackContent}
      </div>
    </>
  )
}