'use client'

import { createContext, useContext, useState, useCallback, FC, PropsWithChildren, useEffect } from 'react'
import { DebugWindowManager } from '@/debug'

interface DebugContextType {
  isDebugMode: boolean
  toggleDebugMode: () => void
  log: (message: string, data?: unknown) => void
  error: (message: string, data?: unknown) => void
  warn: (message: string, data?: unknown) => void
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export const DebugProvider: FC<PropsWithChildren> = ({ children }) => {
  // Move the initialization to useEffect
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [prevDebugMode, setPrevDebugMode] = useState(false)

  // Listen for custom debug-mode-changed event
  useEffect(() => {
    const handleDebugModeChanged = (event: CustomEvent<{ isActive: boolean }>) => {
      setIsDebugMode(event.detail.isActive);
    };

    window.addEventListener('debug-mode-changed', handleDebugModeChanged as EventListener);
    
    return () => {
      window.removeEventListener('debug-mode-changed', handleDebugModeChanged as EventListener);
    };
  }, []);

  useEffect(() => {
    // Skip during SSR or initialization
    if (typeof window === 'undefined') return
    
    // Only open window if debug mode was specifically toggled on
    // (not just initialized from localStorage)
    if (isDebugMode && !prevDebugMode && hasInitialized) {
      const windowManager = DebugWindowManager.getInstance()
      if (windowManager) {
        windowManager.openDebugWindow();
        
        // Set callback for when window is closed
        windowManager.setOnWindowClosed(() => {
          setIsDebugMode(false);
        });
      }
    }
    
    // Update localStorage when debug mode changes
    if (hasInitialized) {
      localStorage.setItem('debug-mode', String(isDebugMode))
    }
    
    setPrevDebugMode(isDebugMode)
  }, [isDebugMode, prevDebugMode, hasInitialized])
  
  // Initialize from localStorage only on client side
  useEffect(() => {
    if (typeof window === 'undefined' || hasInitialized) return
    
    const isDebugWindow = window.location.pathname === '/debug'
    
    if (!isDebugWindow) {
      const savedDebugMode = localStorage.getItem('debug-mode') === 'true'
      setIsDebugMode(savedDebugMode)
      setHasInitialized(true)
      
      // If saved debug mode was true, set up the window close handler
      if (savedDebugMode) {
        const windowManager = DebugWindowManager.getInstance()
        if (windowManager) {
          windowManager.setOnWindowClosed(() => {
            setIsDebugMode(false);
          });
        }
      }
    }
  }, [hasInitialized])

  // Add debug logging helpers
  const log = useCallback((message: string, data?: unknown) => {
    if (isDebugMode && typeof console !== 'undefined') {
      if (data !== undefined) {
        console.log(`[DEBUG] ${message}`, data);
      } else {
        console.log(`[DEBUG] ${message}`);
      }
    }
  }, [isDebugMode]);
  
  const error = useCallback((message: string, data?: unknown) => {
    if (isDebugMode && typeof console !== 'undefined') {
      if (data !== undefined) {
        console.error(`[DEBUG ERROR] ${message}`, data);
      } else {
        console.error(`[DEBUG ERROR] ${message}`);
      }
    }
  }, [isDebugMode]);
  
  const warn = useCallback((message: string, data?: unknown) => {
    if (isDebugMode && typeof console !== 'undefined') {
      if (data !== undefined) {
        console.warn(`[DEBUG WARN] ${message}`, data);
      } else {
        console.warn(`[DEBUG WARN] ${message}`);
      }
    }
  }, [isDebugMode]);

  const toggleDebugMode = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const isDebugWindow = window.location.pathname === '/debug'
    if (isDebugWindow) return
    
    setIsDebugMode(prev => {
      const newValue = !prev
      const windowManager = DebugWindowManager.getInstance()
      
      if (newValue && windowManager) {
        windowManager.openDebugWindow()
        
        // Set callback for when window is closed
        windowManager.setOnWindowClosed(() => {
          setIsDebugMode(false);
        });
      } else if (!newValue && windowManager) {
        windowManager.closeDebugWindow()
      }
      
      return newValue
    })
  }, [])
  
  // Close debug window on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        const windowManager = DebugWindowManager.getInstance()
        if (windowManager) {
          windowManager.closeDebugWindow()
        }
      }
    }
  }, [])

  return (
    <DebugContext.Provider value={{ 
      isDebugMode, 
      toggleDebugMode,
      log,
      error,
      warn
    }}>
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

export { DebugContext }