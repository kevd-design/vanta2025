import { useEffect } from 'react'
import type { ColorMap } from '../../types/colorMap'
import type { ElementMapCell, SanityImageObject } from '../../types'
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
  image?: SanityImageObject
  setDebugContent: (content: DebugContent) => void
}

export const useDebugUpdate = ({
  isDebugMode,
  dimensions,
  colorMap,
  elementMap,
  elementColors,
  image,
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
        accessibilityResults: { elementColors },
        imageDebug: {
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
    setDebugContent
  ])
}