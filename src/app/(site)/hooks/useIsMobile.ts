'use client'

import { useMemo } from 'react'
import { useWindowSize } from './useWindowSize'
import { DIMENSIONS } from '../constants'

export const useIsMobile = () => {
  const { width: screenWidth } = useWindowSize()
  
  const isMobile = useMemo(() => 
    (screenWidth || DIMENSIONS.screen.defaultWidth) < DIMENSIONS.breakpoint.mobile,
    [screenWidth]
  )

  return isMobile
}