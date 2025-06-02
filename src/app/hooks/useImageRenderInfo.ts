import { useMemo } from 'react'
import type { ImageRenderInfo } from '@/app/lib/types/image'
import type { UseImageRenderInfoProps } from '@/app/lib/types/hooks/imageHooks'

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