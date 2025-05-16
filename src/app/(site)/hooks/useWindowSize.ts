'use client'

import { useState, useEffect } from 'react'
import { DIMENSIONS } from '../constants'

interface WindowSize {
  width: number
  height: number
}

export const useWindowSize = (): WindowSize => {
  // Move window check to useEffect
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: DIMENSIONS.screen.defaultWidth,  // Use default values initially
    height: DIMENSIONS.screen.defaultHeight
  })

  useEffect(() => {
    // Update dimensions only on client-side
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: Math.round(window.innerWidth),
        height: Math.round(window.innerHeight)
      })

      function handleResize() {
        setWindowSize({
          width: Math.round(window.innerWidth),
          height: Math.round(window.innerHeight)
        })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}