import { FC, useRef, useState, useEffect, useCallback, RefObject } from 'react'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useImageDimensions } from '../../hooks/useImageDimensions'
import { useDebounce } from '../../hooks/useDebounce'
import { useColorMap } from '../../context/ColorMapContext'
import { useElementMap } from '../../hooks/useElementMap'
import { useAccessibilityMap } from '../../hooks/useAccessibilityMap'
import { useDebugObserver } from '../../hooks/useDebugObserver'
import type { ColorMap } from '../../../types/colorMap'
import type { SanityImageObject } from '../../../types'

interface ImageContainerProps {
  children: (params: {
    containerRef: React.RefObject<HTMLDivElement | null>
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
    colorMap: ColorMap
    elementColors: Record<string, {
      color: 'text-black' | 'text-white' | 'background'
      debugInfo: {
        totalCells: number
        blackVotes: number
        whiteVotes: number
        consensusPercentage: number
      }
    }>
    onColorMapChange: (map: ColorMap) => void
    isDebugMode?: boolean
  }) => React.ReactNode
  className?: string
  isDebugMode?: boolean
  imageId: string
  displayName?: string
  elementRefs: Array<{ 
    ref: RefObject<HTMLElement | null>
    label: string 
  }>
  image?: SanityImageObject | null
}

export const ImageContainer: FC<ImageContainerProps> = ({
  children,
  className,
  isDebugMode,
  imageId,
  displayName,
  elementRefs,
  image
}) => {
  // Window and container state
  const [isReady, setIsReady] = useState(false)
  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use ColorMap context
  const { colorMap, setColorMap } = useColorMap(imageId)

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



  // Only register with debug observer when ready
  useDebugObserver({
    componentId: imageId,
    displayName: displayName || imageId, 
    colorMap: isReady ? colorMap : [],
    elementMap: isReady ? elementMap : [],
    elementColors: isReady ? elementColors : {},
    image,
    enabled: isDebugMode && isReady,
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
const handleColorMapChange = useCallback((newColorMap: ColorMap) => {
  setColorMap((prevMap: ColorMap) => {
    if (prevMap.length === newColorMap.length && 
        prevMap.every((row: ColorMap[number], i: number) => row.length === newColorMap[i].length)) {
      return prevMap;
    }
    return newColorMap;
  });
}, [setColorMap]);

    // Only render children when ready
  const content = isReady ? children({
    containerRef,
    dimensions,
    colorMap,
    elementColors,
    onColorMapChange: handleColorMapChange,
    isDebugMode
  }) : null

  return (
    <div ref={containerRef} className={className}>
      {content}
    </div>
  )
}