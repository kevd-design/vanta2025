'use client'

import { createContext, useContext, useState, PropsWithChildren, FC, useCallback, useEffect, useMemo } from 'react'
import type { ElementMapCell, ImageRenderInfo, ViewportInfo } from '../../app/types'
import type { ColorMap } from '../../app/types/colorMap'
import { DebugWindowManager } from '@/debug'
import { useDebug } from './DebugContext'
import { DebugStorage } from '@/debug'

export type DebugContent = {
  colorMap: ColorMap
  elementMap: ElementMapCell[][]
  dimensions: {
    width: number
    height: number
  }
  displayName?: string
  viewportInfo?: ViewportInfo
  accessibilityResults: {
    elementColors: Record<string, {
      color: 'text-black' | 'text-white' | 'background'
      wcagCompliant?: boolean 
      needsBackground?: boolean 
      debugInfo: {
        totalCells: number
        blackVotes: number
        whiteVotes: number
        consensusPercentage: number
        contrastRatio?: number
        varianceScore?: number
        dpr?: number
      }
    }>
  }
  imageDebug?: {
    displayName?: string
    imageUrl: string
    renderInfo: ImageRenderInfo
    screenDimensions: { width: number; height: number }
  }
}

interface DebugLayoutContextValue {
  debugContent: DebugContent | null
  setDebugContent: (content: DebugContent) => void
}

interface DebugLayoutProviderProps extends PropsWithChildren {
  initialContent?: DebugContent | null;
}



const DebugLayoutContext = createContext<DebugLayoutContextValue | null>(null)

export const DebugLayoutProvider: FC<DebugLayoutProviderProps> = ({ children, initialContent }) => {
  // IMPORTANT: Prioritize initialContent over storage
  const [debugContent, setDebugContent] = useState<DebugContent | null>(() => {
    if (initialContent) {
      console.log('DebugLayoutProvider using initialContent:', {
        displayName: initialContent?.displayName,
        hasContent: !!initialContent
      });
      return initialContent;
    }
    
    const storedContent = DebugStorage.getDebugData();
    if (storedContent) {
      console.log('DebugLayoutProvider using stored content:', {
        displayName: storedContent?.displayName,
        hasContent: !!storedContent
      });
      return storedContent;
    }
    
    console.log('DebugLayoutProvider has no initial content');
    return null;
  });

  const setDebugContentSafe = useCallback((content: DebugContent | ((prev: DebugContent | null) => DebugContent)) => {
    setDebugContent(prev => {
      try {
        const newContent = typeof content === 'function' ? content(prev) : content
        if (!newContent) {
          console.error('Attempted to set null content');
          return prev;
        }
        
        if (prev && JSON.stringify(prev) === JSON.stringify(newContent)) {
          return prev
        }
        
        // Store content in global storage
        DebugStorage.setDebugData(newContent)
        console.log('DebugLayoutProvider updated content:', {
          displayName: newContent?.displayName,
          hasContent: !!newContent
        });
        return newContent
      } catch (err) {
        console.error('Error setting debug content:', err);
        return prev;
      }
    })
  }, [])

  const isDebugWindow = typeof window !== 'undefined' && window.location.pathname === '/debug'

  let isDebugMode = true;
  try {
    const debugContext = useDebug();
    isDebugMode = debugContext.isDebugMode;
  } catch  {
    // In debug window, we assume debug mode is active
    isDebugMode = isDebugWindow;
  }
  

  // Send content to debug window when it changes
  useEffect(() => {
    // Only send from main window and only if window is open
    if (!isDebugWindow && isDebugMode && debugContent) {
      const windowManager = DebugWindowManager.getInstance()
      if (windowManager && windowManager.isOpen()) {
        try {
          // Use direct window access for simpler communication
          const debugWindow = windowManager.getDebugWindow();
          if (debugWindow) {
            console.log('Directly sending update to debug window');
            setTimeout(() => {
              debugWindow.postMessage({
                type: 'DEBUG_UPDATE',
                content: debugContent
              }, '*');
            }, 100);
          } else {
            console.log('Using window manager to send update');
            windowManager.sendDebugUpdate(debugContent);
          }
        } catch (err) {
          console.error('Error sending debug update:', err);
        }
      }
    }
  }, [isDebugMode, debugContent, isDebugWindow])


  // Ensure we're providing a valid context value
  const contextValue = useMemo(() => ({ 
    debugContent, 
    setDebugContent: setDebugContentSafe 
  }), [debugContent, setDebugContentSafe]);

  return (
    <DebugLayoutContext.Provider value={contextValue}>
      {children}
    </DebugLayoutContext.Provider>
  )
}

export const useDebugLayout = () => {
  const context = useContext(DebugLayoutContext);
  if (!context) {
    console.error('useDebugLayout must be used within a DebugLayoutProvider');
    // Return a fallback context to avoid crashes
    return { 
      debugContent: null, 
      setDebugContent: () => console.warn('setDebugContent called outside provider') 
    };
  }
  
  console.log('useDebugLayout called, returning content:', {
    hasContent: !!context.debugContent,
    displayName: context.debugContent?.displayName
  });
  
  return context;
}