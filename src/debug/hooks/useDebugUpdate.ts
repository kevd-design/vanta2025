'use client'

import { useEffect } from 'react'
import type { ColorMap } from '@/app/lib/types/colorMap'
import type { ImageObject } from '@/app/lib/types/image'
import type { ElementMapCell } from '@/app/lib/types/elementMap'
import type { DebugContent } from '../context/DebugLayoutContext'

interface UseDebugUpdateProps {
  isDebugMode: boolean
  dimensions: {
    width: number
    height: number
  } | null
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
  image?: ImageObject
  componentId: string
  displayName: string
  setDebugContent: (content: DebugContent) => void
}

export const useDebugUpdate = ({
  isDebugMode,
  dimensions,
  colorMap,
  elementMap,
  elementColors,
  image,
  componentId,
  displayName,
  setDebugContent
}: UseDebugUpdateProps) => {
  useEffect(() => {
    if (isDebugMode && dimensions) {
      setDebugContent({
        colorMap,
        elementMap,
        dimensions: {
          width: dimensions.width,
          height: dimensions.height
        },
        displayName: displayName || componentId,
        accessibilityResults: { elementColors },
        imageDebug: {
          displayName: displayName || componentId,
          imageUrl: image?.asset?.url ?? '',
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
    }
  }, [
    isDebugMode,
    dimensions,
    colorMap,
    elementMap,
    elementColors,
    image,
    setDebugContent,
    componentId,
    displayName
  ])
}