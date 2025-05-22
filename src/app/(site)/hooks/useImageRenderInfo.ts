import { useMemo } from 'react'
import type { ImageRenderInfo } from '@/app/types'

interface UseImageRenderInfoProps {
  containerWidth: number
  containerHeight: number
  hotspot?: {
    x: number
    y: number
  } | null
  objectFit?: 'cover' | 'contain'
}

export const useImageRenderInfo = ({
  containerWidth,
  containerHeight,
  hotspot,
  objectFit = 'cover'
}: UseImageRenderInfoProps): ImageRenderInfo => {
  return useMemo(() => ({
    containerWidth,
    containerHeight,
    objectFit,
    objectPosition: {
      x: hotspot?.x ?? 0.5,
      y: hotspot?.y ?? 0.5
    }
  }), [
    containerWidth,
    containerHeight,
    objectFit,
    hotspot?.x,
    hotspot?.y
  ])
}