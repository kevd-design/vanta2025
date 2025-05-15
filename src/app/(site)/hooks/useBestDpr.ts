import { useState, useEffect } from 'react'

export function useBestDpr() {
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    function calculateDpr() {
      if (typeof window !== 'undefined') {
        const availWidth = window.screen.availWidth
        if (availWidth > 1920) return 3
        if (availWidth > 1024) return 2
        return 1
      }
      return 1
    }
    setDpr(calculateDpr())

    // Optionally, update on resize:
    function handleResize() {
      setDpr(calculateDpr())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dpr
}