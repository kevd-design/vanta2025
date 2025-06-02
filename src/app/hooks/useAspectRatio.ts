import { useMemo } from 'react'

interface UseAspectRatioProps {
  assetWidth?: number
  assetHeight?: number
  containerWidth: number
  isMobile: boolean
  viewportHeight: number
}

export const useAspectRatio = ({
  assetWidth = 3600,
  assetHeight = 5400,
  containerWidth,
  isMobile,
  viewportHeight
}: UseAspectRatioProps) => {
  return useMemo(() => {
    if (isMobile) {
      return Math.floor(viewportHeight * 0.9) // 90vh on mobile
    }
    
    const aspectRatio = assetHeight / assetWidth
    return Math.round(containerWidth * aspectRatio)
  }, [assetWidth, assetHeight, containerWidth, isMobile, viewportHeight])
}