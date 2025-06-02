import { useMemo } from 'react'
import { calculateDimensions } from '@/app/lib/utils/imageDimensions'
import type { Dimensions } from '@/app/lib/types/layout'

export const useImageDimensions = (
  containerWidth: number,
  screenWidth: number,
  screenHeight: number
): Dimensions => {
  return useMemo(() => {
    const width = Math.round(containerWidth)
    const height = screenWidth >= 2560 ? 2000 : // 2xl
                  screenWidth >= 1536 ? 1800 :  // xl
                  screenWidth >= 1024 ? 1582 :  // lg
                  screenWidth >= 768 ? 1200 :   // md
                  screenWidth >= 640 ? 800 :    // sm
                  Math.floor(screenHeight * 0.9) // mobile
    
    return calculateDimensions(width, height, width / height)
  }, [containerWidth, screenWidth, screenHeight])
}