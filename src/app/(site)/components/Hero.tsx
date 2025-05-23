'use client'

import { FC, useEffect, useState, useRef, useMemo, useCallback, RefObject } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import { useImageColorMap } from '../hooks/useImageColorMap'
import { useElementMap } from '../hooks/useElementMap'
import { useOptimizedImage } from '../hooks/useOptimizedImage'
import { useAccessibilityMap } from '../hooks/useAccessibilityMap'
import { ColorMapOverlay, ElementMapOverlay, DebugControls } from './overlays'
import { useDebug } from '../context/DebugContext'
import { OptimizedImage } from './common/OptimizedImage'
import CTA from './common/Cta'
import type { HeroSection, ElementMapRef, ImageRenderInfo } from '../../types'
import { IMAGE_OPTIONS } from '../constants'

export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  // Debug and window state
  const { isDebugMode } = useDebug()
  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth)
  const [showColorMap, setShowColorMap] = useState(false)
  const [showElementMap, setShowElementMap] = useState(false)
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Element tracking
  const elements = useMemo<ElementMapRef[]>(() => [
    { ref: headlineRef, label: 'Headline' },
    { ref: ctaRef, label: 'CTA' }
  ], [])

  // Container resize handling
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) {
        setContainerWidth(width)
      }
    })
    
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Image dimension calculation
  const getImageDimensions = useMemo(() => {
    const width = Math.round(containerWidth);
  let height: number;

    // Match height to container breakpoints
    if (screenWidth >= 2560) height = 2000      // 2xl
    else if (screenWidth >= 1536) height = 1800  // xl
    else if (screenWidth >= 1024) height = 1582  // lg
    else if (screenWidth >= 768) height = 1200   // md
    else if (screenWidth >= 640) height = 800    // sm
    else height = Math.floor(screenHeight * 0.9) // mobile
    
    return {
      width,
      height,
      aspectRatio: width / height
    }
  }, [containerWidth, screenWidth, screenHeight])

  // Image optimization
  const { generateUrl } = useOptimizedImage({
    asset: image?.asset ?? null,
    hotspot: image?.hotspot ?? null,
    crop: image?.crop ?? null,
    width: getImageDimensions.width,
    height: getImageDimensions.height,
    quality: IMAGE_OPTIONS.quality.medium
  })

  // URL generation effect
  useEffect(() => {
    const url = generateUrl()
    if (url) {
      setOptimizedImageUrl(url)
      if (isDebugMode) {
        console.log('Generated URL:', url)
      }
    }
  }, [generateUrl, isDebugMode])

  // Color map options
  const colorMapOptions = useMemo((): ImageRenderInfo => ({
    containerWidth: Math.round(getImageDimensions.width),
    containerHeight: Math.round(getImageDimensions.height),
    hotspot: image?.hotspot ?? null,
    objectFit: 'cover',
    objectPosition: image?.hotspot 
      ? { x: image.hotspot.x, y: image.hotspot.y }
      : { x: 0.5, y: 0.5 }
  }), [getImageDimensions, image?.hotspot]);



  // Color and element mapping
  const colorMap = useImageColorMap(optimizedImageUrl, colorMapOptions)
  const elementMap = useElementMap(containerRef as RefObject<HTMLElement>, elements).elementMap
  const { elementColors } = useAccessibilityMap(colorMap, elementMap)


  // Debug logging
useEffect(() => {
  if (isDebugMode) {
    console.group('Hero Dimensions Debug')
    console.log('Screen:', { width: screenWidth, height: screenHeight })
    console.log('Container:', { width: containerWidth })
    console.log('Image:', getImageDimensions)
    console.log('Color Map:', {
      width: colorMapOptions.containerWidth,
      height: colorMapOptions.containerHeight
    })
    console.groupEnd()
  }
}, [isDebugMode, screenWidth, screenHeight, containerWidth, getImageDimensions, colorMapOptions])

  // UI helpers
  const getTextColorClass = useCallback((elementLabel: string): string => {
    const colorResult = elementColors[elementLabel]?.color
    return colorResult === 'background' 
      ? 'bg-black/50 px-4 py-2 text-white'
      : colorResult || 'text-white'
  }, [elementColors])

  const toggleColorMap = useCallback(() => setShowColorMap(prev => !prev), [])
  const toggleElementMap = useCallback(() => setShowElementMap(prev => !prev), [])

  // Debug controls renderer
  const renderDebugControls = () => {
    if (!isDebugMode) return null

    return (
      <>
        <ColorMapOverlay 
          colorMap={colorMap ?? []}
          show={showColorMap}
        />
        <ElementMapOverlay 
          elementMap={elementMap}
          show={showElementMap}
        />
        <DebugControls
          showColorMap={showColorMap}
          showElementMap={showElementMap}
          onToggleColorMap={toggleColorMap}
          onToggleElementMap={toggleElementMap}
        />
      </>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="
        relative w-full 
        h-[90vh] 
        sm:h-[800px]
        md:h-[1200px] 
        lg:h-[1582px] 
        xl:h-[1800px] 
        2xl:h-[2000px]
      "
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        {image?.asset && (
          <OptimizedImage
            image={{
              _type: 'imageWithMetadata',
              asset: image.asset,
              hotspot: image.hotspot ?? undefined,
              crop: image.crop ?? undefined
            }}
            width={getImageDimensions.width}
            height={getImageDimensions.height}
            priority
            quality={IMAGE_OPTIONS.quality.medium}
            className="w-full h-full"
            showDebug={isDebugMode}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-15 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
        <div className="w-full flex flex-col items-center md:pt-[40vh] space-y-8">
          {headline && (
            <h1 
              ref={headlineRef}
              className={`font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight px-12 ${getTextColorClass('Headline')}`}
            >
              {headline}
            </h1>
          )}
          {cta && (
            <div 
              ref={ctaRef} 
              className={getTextColorClass('CTA')}
            >
              <CTA {...cta} />
            </div>
          )}
        </div>
      </div>

      {renderDebugControls()}
    </div>
  )
}