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


export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {

  
  const [showColorMap, setShowColorMap] = useState(false);
  const [showElementMap, setShowElementMap] = useState(false);

  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);



  

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

  const renderInfo = useMemo(() => ({
    containerWidth,
    containerHeight: Math.floor(screenHeight * 0.9),
    objectFit: 'cover' as const,
    objectPosition: {
      x: image?.hotspot?.x ?? 0.5,
      y: image?.hotspot?.y ?? 0.5
    }
  }), [
    image?.hotspot?.x,
    image?.hotspot?.y,
    containerWidth,
    screenHeight,
  ]);



const { url: imageUrl, generateUrl, setUrl } = useOptimizedImage({
  asset: image?.asset ?? null,
  hotspot: image?.hotspot ?? null,
  crop: image?.crop ?? null,
  width: screenWidth,
  height: screenHeight
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

  return (
    <div ref={containerRef} className="relative w-full h-[90vh]">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        {imageUrl && image?.asset && (
          <>
          <Image
            src={imageUrl}
            alt={image?.asset?.altText || ''}
            priority
            className="w-full h-full object-cover"
            style={{
              objectPosition: image?.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : '50% 50%'
            }}
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
          {/* Color Map Overlay */}
          {showColorMap && (
            <div className="absolute inset-0 z-10">
              <div 
                className="relative w-full h-full" 
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(100, 1%)',
                  gridTemplateRows: 'repeat(100, 1%)',
                }}
              >
                {colorMap.flat().map((cell, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: cell.color,
                      opacity: 0.5,
                      position: 'relative',
                      width: '100%',
                      height: '100%'
                    }}
                    title={`Luminance: ${cell.luminance.toFixed(2)}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Element Map Overlay */}
        {showElementMap && (
              <div className="absolute inset-0 z-20">
                <div 
                  className="relative w-full h-full border-2 border-black" 
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(100, 1%)',
                    gridTemplateRows: 'repeat(100, 1%)',
                  }}
                >
                  {elementMap.flat().map((cell, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: cell.isElement ? 'rgba(255, 0, 0, 0.3)' : 'transparent',
                        border: cell.isElement ? '1px solid rgba(255, 0, 0, 0.5)' : 'none'
                      }}
                      title={cell.elementLabel}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Button */}
          <div className="absolute top-24 right-4 z-20 flex flex-col gap-2">
              <button
                onClick={toggleColorMap}
                className="bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70"
              >
                {showColorMap ? 'Hide Color Map' : 'Show Color Map'}
              </button>
              <button
                onClick={toggleElementMap}
                className="bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70"
              >
                {showElementMap ? 'Hide Element Map' : 'Show Element Map'}
              </button>
            </div>
        </>
        )}
        
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center pt-30">
        {headline && (
          <h1 
          ref={headlineRef}
          className={`
          text-5xl md:text-7xl font-bold 
          max-w-3xl text-center
          ${getTextColorClass('Headline')}
          `}>
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
  )
}