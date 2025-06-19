import { FC, useRef, useState, useEffect } from 'react'
import { useDebounce } from '@/app/hooks/useDebounce'
import { useWindowSize } from '@/app/hooks/useWindowSize'
import { useImageDimensions } from '@/app/hooks/useImageDimensions'
import type { ImageContainerProps } from '@/app/lib/types/components/common'

// Define a significant size change threshold (in pixels)
const SIZE_CHANGE_THRESHOLD = 150

export const ImageContainer: FC<ImageContainerProps> = ({
  children,
  className,
  setOptimizedImageUrl: externalSetOptimizedImageUrl
}) => {
  // Window and container state
  const [isReady, setIsReady] = useState(false)
  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const [containerWidth, setContainerWidth] = useState(screenWidth)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Store initial dimensions once they're available
  const initialDimensionsRef = useRef<{
    screenWidth: number;
    screenHeight: number;
    containerWidth: number;
  } | null>(null)

  // Calculate dimensions only when we have real container width
  const dimensions = useImageDimensions(
    containerWidth ?? screenWidth,
    screenWidth, 
    screenHeight
  )

  // Initial size measurement
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      if (width > 0) {
        setContainerWidth(width)
        setIsReady(true)
        
        // Store initial dimensions once we have them
        if (!initialDimensionsRef.current) {
          initialDimensionsRef.current = {
            screenWidth,
            screenHeight,
            containerWidth: width
          }
        }
      }
    }
  }, [screenWidth, screenHeight])

  // Resize observer with immediate callback
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width)
      if (width && width > 0) {
        setContainerWidth(width)
        setIsReady(true)
        
        // Store initial dimensions if not already set
        if (!initialDimensionsRef.current) {
          initialDimensionsRef.current = {
            screenWidth,
            screenHeight,
            containerWidth: width
          }
        }
      }
    })
    
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [screenWidth, screenHeight])

  // Width handling with debounce
  const prevWidthRef = useRef(containerWidth)
  const debouncedSetWidth = useDebounce((width: number) => {
    // Only update dimensions if the change is significant enough
    const lastWidth = prevWidthRef.current
    
    // Check if this is URL bar change by comparing against the threshold
    const isSignificantChange = Math.abs(lastWidth - width) >= SIZE_CHANGE_THRESHOLD
    
    if (isSignificantChange) {
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

  // Handle setting optimized image URL - simplified to pass directly to external handler
  const handleSetOptimizedImageUrl = (url: string) => {
    if (externalSetOptimizedImageUrl) {
      externalSetOptimizedImageUrl(url);
    }
  }

  // Only render children when ready - but don't pass containerRef to children
  const content = isReady ? children({
    dimensions,
    setOptimizedImageUrl: handleSetOptimizedImageUrl
  }) : null

  return (
    <div ref={containerRef} className={className}>
      {content}
    </div>
  )
}