'use client'

import { createContext, useContext, useState, PropsWithChildren, FC, useCallback } from 'react'
import type { ElementMapCell, ImageRenderInfo } from '../../types'
import type { ColorMap } from '../../types/colorMap'

export type DebugContent = {
  colorMap: ColorMap
  elementMap: ElementMapCell[][]
  dimensions: {
    width: number
    height: number
  }
  displayName?: string
  accessibilityResults: {
    elementColors: Record<string, {
      color: 'text-black' | 'text-white' | 'background'
      debugInfo: {
        totalCells: number
        blackVotes: number
        whiteVotes: number
        consensusPercentage: number
      }
    }>
  }
  imageDebug?: {
    displayName?: string
    imageUrl: string
    renderInfo: ImageRenderInfo
    screenDimensions: { width: number; height: number }
  }
}

interface DebugLayoutContextValue {
  debugContent: DebugContent | null
  setDebugContent: (content: DebugContent) => void
}

const DebugLayoutContext = createContext<DebugLayoutContextValue | null>(null)

export const DebugLayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const [debugContent, setDebugContent] = useState<DebugContent | null>(null)

    const setDebugContentSafe = useCallback((content: DebugContent | ((prev: DebugContent | null) => DebugContent)) => {
    setDebugContent(prev => {
      const newContent = typeof content === 'function' ? content(prev) : content;
      if (prev && JSON.stringify(prev) === JSON.stringify(newContent)) {
        return prev;
      }
      return newContent;
    });
  }, []);

  return (
    <DebugLayoutContext.Provider value={{ debugContent, setDebugContent: setDebugContentSafe }}>
      {children}
    </DebugLayoutContext.Provider>
  )
}

export const useDebugLayout = () => {
  const context = useContext(DebugLayoutContext)
  if (!context) {
    throw new Error('useDebugLayout must be used within a DebugLayoutProvider')
  }
  return context
}