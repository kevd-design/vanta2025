import { useState, useEffect } from 'react'

export function useBestDpr() {
  const [dpr, setDpr] = useState(1)

 

  useEffect(() => {
    function calculateDpr() {
      if (typeof window !== 'undefined') {
        const devicePixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3)
        return devicePixelRatio
      }
      return 2
    }
    setDpr(calculateDpr())

    
  // Update on resize in case DPR changes (e.g., browser zoom)
  function handleResize() {
    setDpr(calculateDpr())
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dpr
}