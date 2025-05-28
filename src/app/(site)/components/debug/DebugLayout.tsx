'use client'

import { FC, PropsWithChildren } from 'react'
import { DebugStatus } from './DebugStatus'

export const DebugLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
  <>
    {children}
    <DebugStatus />
  </>
  )
}