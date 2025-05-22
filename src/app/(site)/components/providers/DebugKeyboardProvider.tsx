'use client'

import { FC, PropsWithChildren } from 'react'
import { useDebugKeyboard } from '../../hooks/useDebugKeyboard'

export const DebugKeyboardProvider: FC<PropsWithChildren> = ({ children }) => {
  useDebugKeyboard()
  return <>{children}</>
}