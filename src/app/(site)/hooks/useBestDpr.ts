import { useState, useEffect } from 'react'

const MIN_DPR = 1
const MAX_DPR = 3
const DEFAULT_DPR = 2

export function useBestDpr() {
  const [dpr, setDpr] = useState(DEFAULT_DPR)

  useEffect(() => {
    function calculateDpr() {
      if (typeof window === 'undefined') return DEFAULT_DPR
      
      const devicePixelRatio = window.devicePixelRatio || MIN_DPR
      return Math.min(Math.max(devicePixelRatio, MIN_DPR), MAX_DPR)
    }

    function handleResize() {
      setDpr(calculateDpr())
    }

    // Initial calculation
    setDpr(calculateDpr())

    // Update on resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dpr
}