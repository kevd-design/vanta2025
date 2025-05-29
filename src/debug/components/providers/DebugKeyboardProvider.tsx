'use client'

import { FC, PropsWithChildren } from 'react'
import { useDebugKeyboard } from '../../hooks/useDebugKeyboard'

export const DebugKeyboardProvider: FC<PropsWithChildren> = ({ children }) => {
  // This hook will handle keyboard shortcuts and open the debug window when needed
  useDebugKeyboard()
  
  return <>{children}</>
}