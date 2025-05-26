'use client'

import { FC, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useDebug } from '../context/DebugContext'
import { HeroBackground } from './HeroBackground'
import { HeroContent } from './HeroContent'
import { ImageContainer } from './common/ImageContainer'
import type { HeroSection } from '../../types'

export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  const { isDebugMode } = useDebug()
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const elementRefs = useMemo(() => [
    { ref: headlineRef, label: 'Headline' },
    { ref: ctaRef, label: 'CTA' }
  ], [])

  const fallbackContent = (
    <noscript>
      <div className="relative w-full h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px]">
        {image?.asset?.url && (
          <>
            {/* Fallback image */}
            <Image
              src={image.asset.url}
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
        {({ dimensions, onColorMapChange, elementColors }) => (
          <>
            <HeroBackground 
              image={image}
              dimensions={dimensions}
              isDebugMode={isDebugMode}
              onColorMapChange={onColorMapChange}
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