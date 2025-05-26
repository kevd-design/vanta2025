'use client'

import { FC, useRef, useMemo } from 'react'
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


  return (
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
  )
}