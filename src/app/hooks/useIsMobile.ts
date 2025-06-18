'use client'

import { useMemo } from 'react'
import { DIMENSIONS } from '@/app/constants'
import { useWindowSize } from '@/app/hooks/useWindowSize'

export const useIsMobile = () => {
  const { width: screenWidth } = useWindowSize()
  
  // Use default width until hydrated with real value
  const isMobile = useMemo(() => 
    (screenWidth || DIMENSIONS.screen.defaultWidth) < DIMENSIONS.breakpoint.mobile,
    [screenWidth]
  )

  return isMobile
}