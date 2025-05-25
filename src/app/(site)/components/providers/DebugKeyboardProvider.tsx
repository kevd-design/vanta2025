'use client'

import { FC, PropsWithChildren, useEffect } from 'react'
import { useDebug } from '../../context/DebugContext'
import { useDebugLayout } from '../../context/DebugLayoutContext'
import type { DebugContent } from '../../context/DebugLayoutContext' 

export const DebugKeyboardProvider: FC<PropsWithChildren> = ({ children }) => {
  const { toggleDebugMode, isDebugMode } = useDebug()
  const { setDebugContent } = useDebugLayout() 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        toggleDebugMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleDebugMode])

  // Clear debug content when debug mode is turned off
  useEffect(() => {
    if (!isDebugMode) {
      // Type assertion to handle null case
      setDebugContent(undefined as unknown as DebugContent)
    }
  }, [isDebugMode, setDebugContent])

  return <>{children}</>
}