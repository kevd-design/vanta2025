'use client'

import { createContext, useContext, useCallback, useState, FC, PropsWithChildren } from 'react'
import type { ColorMap, ImageMetadata, ColorMapData } from '../../types/colorMap'

// Remove duplicate interface definitions since we're importing them

interface ColorMapContextValue {
  colorMaps: Record<string, ColorMapData>;
  setColorMap: (
    id: string, 
    mapData: ColorMapData | ((prev: ColorMapData) => ColorMapData)
  ) => void;
  getColorMap: (id: string) => ColorMap | undefined;
  getMetadata: (id: string) => ImageMetadata | undefined;
  clearColorMap: (id: string) => void;
}

const ColorMapContext = createContext<ColorMapContextValue | null>(null)

export const ColorMapProvider: FC<PropsWithChildren> = ({ children }) => {
  // Update to store both map and metadata
  const [colorMaps, setColorMaps] = useState<Record<string, ColorMapData>>({})

  const setColorMap = useCallback((
    id: string, 
    mapData: ColorMapData | ((prev: ColorMapData) => ColorMapData)
  ) => {
    setColorMaps(prev => {
      const prevData = prev[id] || { map: [] };
      const newData = typeof mapData === 'function' ? 
        mapData(prevData) : mapData;
        
      // Preserve metadata if only the map was provided
      if (!newData.metadata && prevData.metadata) {
        newData.metadata = prevData.metadata;
      }
      
      return {
        ...prev,
        [id]: newData
      };
    });
  }, []);

  const getColorMap = useCallback((id: string) => {
    return colorMaps[id]?.map;
  }, [colorMaps]);
  
  const getMetadata = useCallback((id: string) => {
    return colorMaps[id]?.metadata;
  }, [colorMaps]);

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
      getMetadata,
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
    metadata: context.getMetadata(id),
    setColorMap: (mapData: ColorMapData | ((prev: ColorMapData) => ColorMapData)) => 
      context.setColorMap(id, mapData),
    setColorMapWithMetadata: (
      map: ColorMap, 
      metadata: ImageMetadata
    ) => context.setColorMap(id, { map, metadata }),
    clearColorMap: () => context.clearColorMap(id)
  }
}