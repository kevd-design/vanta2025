'use client'

import { FC, useRef, useState, useCallback, RefObject, useEffect } from 'react'
import { useDebug } from '../context/DebugContext'
import { useWindowSize } from '../hooks/useWindowSize'
import { useElementMap } from '../hooks/useElementMap'
import { useAccessibilityMap } from '../hooks/useAccessibilityMap'
import { useImageDimensions } from '../hooks/useImageDimensions'
import { useImageDebug } from '../hooks/useImageDebug'
import { useOptimizedImage } from '../hooks/useOptimizedImage'
import { useDebounce } from '../hooks/useDebounce'
import { HeroBackground } from './HeroBackground'
import { HeroContent } from './HeroContent'
import type { HeroSection } from '../../types'
import { IMAGE_OPTIONS } from '../constants'
import type { ColorMap } from '../../types/colorMap'
import { useDebugLayout } from '../context/DebugLayoutContext'

export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  // Debug and window state
  const { isDebugMode } = useDebug()
  const { setDebugContent } = useDebugLayout()

  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth)
  

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const handleResize = useDebounce<[number], void>((width) => {
    setContainerWidth(width)
  }, 150)

  // Resize observer to track container width
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) {
        handleResize(width)
      }
    })
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      handleResize.cancel()
      observer.disconnect()
    }
  }, [handleResize])

  // Element tracking
  const { elementMap } = useElementMap(
    containerRef as RefObject<HTMLElement>,
    [
      { ref: headlineRef, label: 'Headline' },
      { ref: ctaRef, label: 'CTA' }
  ])

  // Image and color mapping
  const dimensions = useImageDimensions(containerWidth, screenWidth, screenHeight)

  // Get optimized image URL
  const { url: optimizedImageUrl } = useOptimizedImage({
    asset: image?.asset ?? null,
    hotspot: image?.hotspot ?? null,
    crop: image?.crop ?? null,
    width: dimensions.width,
    height: dimensions.height,
    quality: IMAGE_OPTIONS.quality.medium
  })




const [colorMap, setColorMap] = useState<ColorMap>([])
const { elementColors } = useAccessibilityMap(colorMap, elementMap)



  // Debug logging
  useImageDebug(
    'Hero',
    isDebugMode,
    screenWidth,
    screenHeight,
    containerWidth,
    dimensions,
    optimizedImageUrl
  )

  // UI helpers
  const getTextColorClass = useCallback((elementLabel: string): string => {
    const colorResult = elementColors[elementLabel]?.color
    return colorResult === 'background' 
      ? 'bg-black/50 px-4 py-2 text-white'
      : colorResult || 'text-white'
  }, [elementColors])

  // Update debug content whenever relevant data changes
  useEffect(() => {
    if (isDebugMode) {
      setDebugContent({
        colorMap,
        elementMap,
        dimensions,
        accessibilityResults: { elementColors },
        imageDebug: {
          imageUrl: optimizedImageUrl || '',
          renderInfo: {
            containerWidth: dimensions.width,
            containerHeight: dimensions.height,
            objectFit: 'cover',
            objectPosition: image?.hotspot 
              ? { x: image.hotspot.x, y: image.hotspot.y }
              : { x: 0.5, y: 0.5 }
          },
          screenDimensions: { 
            width: screenWidth, 
            height: screenHeight 
          }
        }
      })
    }
  }, [
    isDebugMode,
    colorMap,
    elementMap,
    dimensions,
    elementColors,
    optimizedImageUrl,
    screenWidth,
    screenHeight,
    image?.hotspot,
    setDebugContent
  ])


  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px]"
    >
      <HeroBackground 
        image={image}
        dimensions={dimensions}
        isDebugMode={isDebugMode}
        onColorMapChange={setColorMap}
      />

      <HeroContent
        headline={headline}
        cta={cta}
        headlineRef={headlineRef}
        ctaRef={ctaRef}
        getTextColorClass={getTextColorClass}
      />


    </div>
  )
}