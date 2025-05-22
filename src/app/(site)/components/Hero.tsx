'use client'

import { FC, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { useOptimizedImage } from '../hooks/useOptimizedImage'
import CTA from './common/Cta'
import type { HeroSection } from '../../types'
import { useImageColorMap } from '../hooks/useImageColorMap';
import { useElementMap } from '../hooks/useElementMap'
import { useAccessibilityMap } from '../hooks/useAccessibilityMap'
import { useImageRenderInfo } from '../hooks/useImageRenderInfo'
import { ColorMapOverlay, ElementMapOverlay, DebugControls, ImageDebugOverlay } from './overlays'
import { useDebug } from '../context/DebugContext'


export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {

  console.log('image', image)

  const { isDebugMode } = useDebug()
  const [showColorMap, setShowColorMap] = useState(false);
  const [showElementMap, setShowElementMap] = useState(false);

  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const renderInfo = useImageRenderInfo({
  containerWidth,
  containerHeight: screenWidth >= 768 ? 1582 : Math.floor(screenHeight * 0.9),
  hotspot: image?.hotspot
  })

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) {
        setContainerWidth(width);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);





const { url: imageUrl, generateUrl, setUrl } = useOptimizedImage({
  asset: image?.asset ?? null,
  hotspot: image?.hotspot ?? null,
  crop: image?.crop ?? null,
  width: screenWidth,
  height: screenHeight,
  quality: 70
})

  // Generate image URL on mount and screen size changes
  useEffect(() => {
    const url = generateUrl()
    if (url) setUrl(url)
  }, [screenWidth, screenHeight, generateUrl, setUrl])

  const elements = useMemo(() => [
  { ref: headlineRef, label: 'Headline' },
  { ref: ctaRef, label: 'CTA' }
], []);


  const colorMap = useImageColorMap(imageUrl, renderInfo);
  
  const { elementMap } = useElementMap(
    containerRef as React.RefObject<HTMLElement>,
    elements
  );

  const { elementColors } = useAccessibilityMap(colorMap, elementMap);

  const debugInfo = useMemo(() => ({
    hasColorMap: colorMap.length > 0,
    hasElementMap: elementMap.length > 0,
    elementColors
  }), [colorMap.length, elementMap.length, elementColors]);

  useEffect(() => {
    console.log('Maps updated:', debugInfo);
  }, [debugInfo]);



const getTextColorClass = useCallback((elementLabel: string): string => {
  const colorResult = elementColors[elementLabel]?.color;
  if (colorResult === 'background') {
    return 'bg-black/50 px-4 py-2 text-white';
  }
  return colorResult || 'text-white';
}, [elementColors]);
  
const toggleColorMap = useCallback(() => {
  setShowColorMap(prev => !prev);
}, []);

const toggleElementMap = useCallback(() => {
  setShowElementMap(prev => !prev);
}, []);

useEffect(() => {
  const url = generateUrl()
  if (url) {
    console.log('Generated Image URL:', {
      url,
      crop: image?.crop,
      hotspot: image?.hotspot,
      dimensions: {
        screen: { width: screenWidth, height: screenHeight },
        container: { width: containerWidth, height: Math.floor(screenHeight * 0.9) }
      }
    });
    setUrl(url)
  }
}, [screenWidth, screenHeight, generateUrl, setUrl, image?.crop, image?.hotspot, containerWidth])


  // Only render debug controls if debug mode is enabled
  const renderDebugControls = () => {
    if (!isDebugMode) return null

    return (
      <>
        <ColorMapOverlay 
          colorMap={colorMap} 
          show={showColorMap} 
        />
        <ElementMapOverlay 
          elementMap={elementMap} 
          show={showElementMap}
        />
        <ImageDebugOverlay
          show={true}
          imageUrl={imageUrl || ''}
          renderInfo={renderInfo}
          screenDimensions={{
            width: screenWidth,
            height: screenHeight
          }}
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
    <div ref={containerRef} className="
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
        {imageUrl && image?.asset && (
          <>
          <Image
            src={imageUrl}
            alt={image?.asset?.altText || ''}
            priority
            className="w-full h-full object-cover"

            sizes="100vw"
            placeholder={image?.asset?.metadata?.lqip ? "blur" : undefined}
            blurDataURL={image?.asset?.metadata?.lqip}
            fill
            onError={(e) => {
              console.error('Image failed to load:', {
                src: imageUrl,
                error: e
              });
            }}
          />
          {renderDebugControls()}

        </>
        )}
        
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
        <div className="w-full flex flex-col items-center md:pt-[40vh] space-y-8">
          {headline && (
            <h1 
            ref={headlineRef}
            className={`font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight px-12 ${getTextColorClass('Headline')}`}>
              {headline}
            </h1>
          )}
          {cta && (
            <div 
            ref={ctaRef} 
            className={`
              mt-8
              ${getTextColorClass('CTA')}

            `}>
              <CTA {...cta} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}