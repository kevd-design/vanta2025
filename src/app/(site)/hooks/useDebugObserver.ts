import { useEffect, useRef } from 'react'
import { useDebug } from '../context/DebugContext'
import { useDebugLayout } from '../context/DebugLayoutContext'
import type { DebugContent } from '../context/DebugLayoutContext'
import type { ColorMap } from '../../types/colorMap'
import type { ElementMapCell, SanityImageObject } from '../../types'

interface DebugObserverProps {
  componentId: string
  displayName: string
  colorMap?: ColorMap
  elementMap?: ElementMapCell[][]
  elementColors?: Record<string, {
    color: 'text-black' | 'text-white' | 'background'
    debugInfo: {
      totalCells: number
      blackVotes: number
      whiteVotes: number
      consensusPercentage: number
    }
  }>
  image?: SanityImageObject | null
  dimensions?: {
    width: number
    height: number
  }
  enabled?: boolean
}

export const useDebugObserver = ({
  componentId,
  displayName,
  colorMap,
  elementMap,
  elementColors,
  image,
  dimensions,
  enabled = true
}: DebugObserverProps) => {
  const { isDebugMode } = useDebug()
  const { setDebugContent } = useDebugLayout()
  const dataRef = useRef<Partial<DebugContent> | null>(null)
  
  // Update when any data changes
  useEffect(() => {
    // Only store data if component is enabled and we have valid data
    if (!enabled || !isDebugMode) return

    // Calculate aspect ratios
  const calculatedAspectRatio = dimensions 
    ? dimensions.width / dimensions.height 
    : 0
    
  const sourceAspectRatio = image?.asset?.metadata?.dimensions 
    ? image.asset.metadata.dimensions.width / image.asset.metadata.dimensions.height
    : 0
    
dataRef.current = {
  colorMap: colorMap || [],
  elementMap: elementMap || [],
  dimensions: dimensions || { width: 0, height: 0 },
  displayName,
  ...(elementColors && { accessibilityResults: { elementColors } }),
  ...(image?.asset?.url && {
    imageDebug: {
      displayName,
      imageUrl: image.asset.url,
      renderInfo: {
        containerWidth: dimensions?.width || 0,
        containerHeight: dimensions?.height || 0,
        objectFit: 'cover',
        objectPosition: { 
          x: image?.hotspot?.x ?? 0.5, 
          y: image?.hotspot?.y ?? 0.5 
        },
        hotspot: image?.hotspot,
        debug: {
          calculatedAspectRatio,
          sourceAspectRatio,
          originalDimensions: image.asset.metadata?.dimensions ? {
            width: image.asset.metadata.dimensions.width,
            height: image.asset.metadata.dimensions.height,
            // Only include aspectRatio if it exists
            ...(image.asset.metadata.dimensions.aspectRatio && {
              aspectRatio: image.asset.metadata.dimensions.aspectRatio
            })
          } : undefined
        }
      },
      screenDimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  })
}

    // Update debug content immediately if we have data
    if (dataRef.current) {
      setDebugContent(dataRef.current as DebugContent)
      console.log(`Debug content updated from ${componentId}`, {
        hasColorMap: !!colorMap?.length,
        hasElementMap: !!elementMap?.length,
        hasImage: !!image?.asset?.url
      })
    }
  }, [
    isDebugMode,
    enabled,
    colorMap,
    elementMap,
    elementColors,
    image,
    dimensions,
    componentId,
    setDebugContent,
    displayName
  ])
  
  return { isActive: isDebugMode && enabled }
}