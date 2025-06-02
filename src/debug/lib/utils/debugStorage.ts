'use client'

import type { DebugContent } from '../../context/DebugLayoutContext'

// Global store for debug data that persists across component unmounts
let globalDebugData: DebugContent | null = null

export const DebugStorage = {
  setDebugData: (data: DebugContent | null) => {
    globalDebugData = data
    
    // Also save to sessionStorage for persistence across refreshes
    if (typeof window !== 'undefined' && data) {
      try {
        // Only store minimal data to avoid storage limits
        const minimalData = {
          displayName: data.displayName,
          dimensions: data.dimensions,
          hasColorMap: !!data.colorMap?.length,
          hasElementMap: !!data.elementMap?.length,
          timestamp: Date.now()
        }
        sessionStorage.setItem('debug-data-info', JSON.stringify(minimalData))
      } catch (err) {
        console.warn('Could not save debug data to sessionStorage', err)
      }
    }
  },
  
  getDebugData: () => globalDebugData,
  
  hasDebugData: () => !!globalDebugData
}