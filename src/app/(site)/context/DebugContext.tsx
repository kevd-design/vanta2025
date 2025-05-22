'use client'

import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  FC, 
  PropsWithChildren 
} from 'react'

interface DebugContextType {
  isDebugMode: boolean
  toggleDebugMode: () => void
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export const DebugProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState(false)

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(prev => !prev)
  }, [])

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode }}>
      {children}
    </DebugContext.Provider>
  )
}

export const useDebug = () => {
  const context = useContext(DebugContext)
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider')
  }
  return context
}

// Ensure we export all components and hooks
export { DebugContext }