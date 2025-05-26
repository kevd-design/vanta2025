'use client'

import { createContext, useContext, useCallback, useState, FC, PropsWithChildren } from 'react'
import type { ColorMap } from '../../types/colorMap'

interface ColorMapContextValue {
  colorMaps: Record<string, ColorMap>
  setColorMap: (
    id: string, 
    map: ColorMap | ((prev: ColorMap) => ColorMap)
  ) => void
  getColorMap: (id: string) => ColorMap | undefined
  clearColorMap: (id: string) => void
}

const ColorMapContext = createContext<ColorMapContextValue | null>(null)

export const ColorMapProvider: FC<PropsWithChildren> = ({ children }) => {
  const [colorMaps, setColorMaps] = useState<Record<string, ColorMap>>({})

  const setColorMap = useCallback((id: string, map: ColorMap | ((prev: ColorMap) => ColorMap)) => {
    setColorMaps(prev => ({
      ...prev,
      [id]: typeof map === 'function' ? map(prev[id] ?? []) : map
    }))
  }, [])

  const getColorMap = useCallback((id: string) => {
    return colorMaps[id]
  }, [colorMaps])

  const clearColorMap = useCallback((id: string) => {
    setColorMaps(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  return (
    <ColorMapContext.Provider value={{
      colorMaps,
      setColorMap,
      getColorMap,
      clearColorMap
    }}>
      {children}
    </ColorMapContext.Provider>
  )
}

export const useColorMap = (id: string) => {
  const context = useContext(ColorMapContext)
  if (!context) {
    throw new Error('useColorMap must be used within a ColorMapProvider')
  }

  return {
    colorMap: context.getColorMap(id) ?? [],
    setColorMap: (map: ColorMap | ((prev: ColorMap) => ColorMap)) => context.setColorMap(id, map),
    clearColorMap: () => context.clearColorMap(id)
  }
}