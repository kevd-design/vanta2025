import { FC, useRef, useState, useEffect, useCallback, RefObject } from 'react'
import { useDebugObserver } from '@/debug'
import { useColorMap } from '@/app/context/ColorMapContext'
import { useDebounce } from '@/app/hooks/useDebounce'
import { useWindowSize } from '@/app/hooks/useWindowSize'
import { useElementMap } from '@/app/hooks/useElementMap'
import { useImageDimensions } from '@/app/hooks/useImageDimensions'
import { useAccessibilityMap } from '@/app/hooks/useAccessibilityMap'
import type { ColorMap } from '@/app/lib/types/colorMap'
import type { ImageMetadata } from '@/app/lib/types/image'
import type { ImageContainerProps } from '@/app/lib/types/components/common'

export const ImageContainer: FC<ImageContainerProps> = ({
  children,
  className,
  isDebugMode,
  imageId,
  displayName,
  elementRefs,
  image,
  setOptimizedImageUrl: externalSetOptimizedImageUrl
}) => {
  // Window and container state
  const [isReady, setIsReady] = useState(false)
  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth)
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use ColorMap context
  const { 
    colorMap, 
    setColorMap,
    setColorMapWithMetadata 
  } = useColorMap(imageId)

  // Calculate dimensions only when we have real container width
  const dimensions = useImageDimensions(
    containerWidth ?? screenWidth,
    screenWidth, 
    screenHeight
  )

  // Element and accessibility mapping
  const { elementMap } = useElementMap(
    containerRef as RefObject<HTMLElement>,
    elementRefs
  )
  
  const { elementColors } = useAccessibilityMap(colorMap, elementMap)




  useDebugObserver({
    componentId: imageId,
    displayName: displayName || imageId, 
      // Only pass color map if it's valid
    colorMap: colorMap && colorMap.length > 0 && colorMap.every(row => Array.isArray(row) && row.length > 0) 
      ? colorMap 
      : undefined,
    elementMap: isReady ? elementMap : [],
    elementColors: isReady ? elementColors : {},
    image,
    enabled: isDebugMode && isReady,
    optimizedImageUrl: optimizedImageUrl || undefined, 
    dimensions: isReady ? {
      width: dimensions.width,
      height: dimensions.height
    } : undefined
  })

    // Initial size measurement
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      if (width > 0) {
        setContainerWidth(width)
        setIsReady(true)
      }
    }
  }, [])

    // Resize observer with immediate callback
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width)
      if (width && width > 0) {
        setContainerWidth(width)
        setIsReady(true)
      }
    })
    
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])


  // Width handling with debounce
  const prevWidthRef = useRef(containerWidth)
  const debouncedSetWidth = useDebounce((width: number) => {
    if (Math.abs(prevWidthRef.current - width) >= 10) {
      prevWidthRef.current = width
      setContainerWidth(width)
    }
  }, 250)

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width)
      if (width && width > 0) {
        debouncedSetWidth(width)
      }
    })
    
    observer.observe(containerRef.current)

    return () => {
      debouncedSetWidth.cancel()
      observer.disconnect()
    }
  }, [debouncedSetWidth])

  // Color map update handler
  const handleColorMapChange = useCallback((
    newColorMap: ColorMap, 
    metadata?: ImageMetadata
  ) => {
    if (metadata) {
      // If we have metadata, store both map and metadata
      setColorMapWithMetadata(newColorMap, metadata);
    } else {
      // Otherwise just update the map
      setColorMap(prevData => ({
        ...prevData,
        map: newColorMap
      }));
    }
  }, [setColorMap, setColorMapWithMetadata]);

    // Use external setter if provided, or fallback to local state setter
  const handleSetOptimizedImageUrl = useCallback((url: string) => {
    setOptimizedImageUrl(url);
    if (externalSetOptimizedImageUrl) {
      externalSetOptimizedImageUrl(url);
    }
  }, [externalSetOptimizedImageUrl]);

    // Only render children when ready
  const content = isReady ? children({
    containerRef,
    dimensions,
    colorMap,
    elementColors,
    setOptimizedImageUrl: handleSetOptimizedImageUrl,  // Pass the handler function
    onColorMapChange: handleColorMapChange,
    isDebugMode
  }) : null

  return (
    <div ref={containerRef} className={className}>
      {content}
    </div>
  )
}