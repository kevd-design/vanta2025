'use client'

import { useState, useEffect } from 'react'
import { DIMENSIONS } from '../constants'

interface WindowSize {
  width: number
  height: number
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: Math.round(typeof window !== 'undefined' ? window.innerWidth : DIMENSIONS.screen.defaultWidth),
    height: Math.round(typeof window !== 'undefined' ? window.innerHeight : DIMENSIONS.screen.defaultHeight),
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: Math.round(window.innerWidth),
        height: Math.round(window.innerHeight),
      })
    }

    // Only add listener if window exists
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize)
      // Initial size set
      handleResize()
      
      return () => window.removeEventListener("resize", handleResize)
    }

  }, [])

  return windowSize
}