import { useEffect, useRef } from 'react'
import type { Dimensions } from '../../types'

export const useImageDebug = (
    componentName: string,
    isDebugMode: boolean,
    screenWidth: number,
    screenHeight: number,
    containerWidth: number,
    imageDimensions: Dimensions,
    imageUrl?: string | null
) => {
  const lastLoggedUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!isDebugMode) return
    const currentUrl = imageUrl ?? null
    // Only log if URL changed or is different from last logged
    if (currentUrl !== lastLoggedUrl.current) {
      lastLoggedUrl.current = currentUrl
      lastLoggedUrl.current = currentUrl
      console.group(`Dimensions Debug for ${componentName}`)
      console.log('Screen:', { width: screenWidth, height: screenHeight })
      console.log('Container:', { width: containerWidth })
      console.log('Image:', imageDimensions)
      console.log('Image URL:', imageUrl)
      console.groupEnd()
    }
  }, [componentName, isDebugMode, screenWidth, screenHeight, containerWidth, 
      imageDimensions, imageUrl])
}