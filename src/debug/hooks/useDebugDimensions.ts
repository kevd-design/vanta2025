'use client'

import { useCallback } from 'react'
import type { DebugContent } from '../context/DebugLayoutContext'
import type { ColorMap } from '@/app/lib/types/colorMap'
import type { ImageObject } from '@/app/lib/types/image'
import type { ElementMapCell } from '@/app/lib/types/elementMap'

interface UseDebugDimensionsProps {
  isDebugMode: boolean
  colorMap: ColorMap
  elementMap: ElementMapCell[][]
  elementColors: Record<string, {
    color: 'text-black' | 'text-white' | 'background'
    debugInfo: {
      totalCells: number
      blackVotes: number
      whiteVotes: number
      consensusPercentage: number
    }
  }>
  image: ImageObject | null | undefined
  setDebugContent: (content: DebugContent) => void
}


export const useDebugDimensions = ({
  isDebugMode,
  colorMap,
  elementMap,
  elementColors,
  image,
  setDebugContent
}: UseDebugDimensionsProps) => {
  const updateDebugContent = useCallback(
    (dimensions: { width: number; height: number }) => {
      if (!isDebugMode) return;

    const debugContent: DebugContent = {
      colorMap,
      elementMap,
      dimensions,
      accessibilityResults: { elementColors },
      ...(image?.asset?.url && {
        imageDebug: {
          imageUrl: image.asset.url,
          renderInfo: {
            containerWidth: dimensions.width,
            containerHeight: dimensions.height,
            objectFit: 'cover',
            objectPosition: { x: 0.5, y: 0.5 },
            hotspot: image?.hotspot
          },
          screenDimensions: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      })
    };

    setDebugContent(debugContent)
  },
  [isDebugMode, colorMap, elementMap, elementColors, image, setDebugContent]
  );


  return { updateDebugContent }
}