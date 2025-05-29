'use client'

import { useEffect, useRef, useState } from 'react'
import { useDebug } from '../context/DebugContext'
import { useDebugLayout } from '../context/DebugLayoutContext'
import type { DebugContent } from '../context/DebugLayoutContext'
import type { ColorMap } from '../../app/types/colorMap'
import type { ElementMapCell, SanityImageObject, ViewportInfo } from '../../app/types'
import { DebugWindowManager } from '../utils/debugWindowManager'
import { throttle } from '../../app/(site)/utils/throttle'

interface DebugObserverProps {
  componentId: string
  displayName: string
  colorMap?: ColorMap
  elementMap?: ElementMapCell[][]
  elementColors?: Record<string, {
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
  image?: SanityImageObject | null
  optimizedImageUrl?: string | null 
  dimensions?: {
    width: number
    height: number
  }
  enabled?: boolean
}



export const useDebugObserver = ({
  componentId,
  displayName,
  colorMap,
  elementMap,
  elementColors,
  image,
  optimizedImageUrl,
  dimensions,
  enabled = true
}: DebugObserverProps) => {
  const { isDebugMode, log } = useDebug()
  const { setDebugContent } = useDebugLayout()
  const dataRef = useRef<Partial<DebugContent> | null>(null)
  const windowRef = useRef<Window | null>(null)
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
    scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    scrollX: typeof window !== 'undefined' ? window.scrollX : 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    zoomLevel: typeof window !== 'undefined' ? (window.visualViewport?.scale || 1) : 1, // This is browser zoom
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1 // This is device pixel ratio
  })
  
  // Check if debug is actually active
  const isActive = isDebugMode && enabled
  
  // Track window manager to avoid creating it multiple times
  useEffect(() => {
    if (isActive && typeof window !== 'undefined') {
      windowRef.current = window
    }
  }, [isActive])
  
  // Set up viewport tracking
  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return;
    
    // Scroll state tracking
    let isScrolling = false;
    let scrollTimer: NodeJS.Timeout | null = null;
    
    // Function to update viewport information
    const updateViewportInfo = () => {
      // Check if window is currently being resized
      const windowManager = DebugWindowManager.getInstance();
      const isResizing = windowManager?.getResizeState() === 'resizing';
      
      // Skip updates if resizing
      if (isResizing) {
        return;
      }
      
      const newViewportInfo = {
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        width: window.innerWidth,
        height: window.innerHeight,
        zoomLevel:  window.visualViewport?.scale || 1,
        dpr: window.devicePixelRatio || 1
      };
      
      // Update local state always
      setViewportInfo(newViewportInfo);
      
      // Send direct updates to debug window for better responsiveness
      if (windowManager && windowManager.isOpen()) {
        try {
          const debugWindow = windowManager.getDebugWindow();
          if (debugWindow && !debugWindow.closed) {
            debugWindow.postMessage({
              type: 'DEBUG_VIEWPORT_UPDATE',
              viewportInfo: newViewportInfo,
              timestamp: Date.now()
            }, '*');
          }
        } catch (err) {
          console.error('Error sending viewport update:', err);
        }
      }
      
      // Also update the debug content with new viewport info
      if (dataRef.current) {
        const updatedContent = {
          ...dataRef.current,
          viewportInfo: newViewportInfo
        } as DebugContent;
        
        setDebugContent(updatedContent);
      }
    };
  
    // Handle scroll start - notify about scrolling state
    const handleScrollStart = () => {
      if (isScrolling) return;
      
      isScrolling = true;
      
      // Notify debug window that scrolling started
      const windowManager = DebugWindowManager.getInstance();
      if (windowManager && windowManager.isOpen()) {
        try {
          const debugWindow = windowManager.getDebugWindow();
          if (debugWindow && !debugWindow.closed) {
            debugWindow.postMessage({
              type: 'DEBUG_SCROLL_STATE',
              state: 'scrolling'
            }, '*');
          }
        } catch {
          // Silent error to avoid console spam
        }
      }
      
      // Clear any existing timer
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
    
    // Handle scroll end - notify and update final position
    const handleScrollEnd = () => {
      // Skip if not scrolling
      if (!isScrolling) return;
      
      // Set a timer to detect when scrolling is finished
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      
      scrollTimer = setTimeout(() => {
        isScrolling = false;
        
        // Notify debug window that scrolling ended
        const windowManager = DebugWindowManager.getInstance();
        if (windowManager && windowManager.isOpen()) {
          try {
            const debugWindow = windowManager.getDebugWindow();
            if (debugWindow && !debugWindow.closed) {
              // Send the current scroll state
              debugWindow.postMessage({
                type: 'DEBUG_SCROLL_STATE',
                state: 'completed'
              }, '*');
              
              // Send final position after a brief delay for smoother UI
              setTimeout(() => updateViewportInfo(), 100);
            }
          } catch {
            // Ignore errors
          }
        } else {
          // Update viewport info even if debug window is closed
          updateViewportInfo();
        }
      }, 200);
    };
    
    // Use throttled scroll handler that detects scroll state transitions
    const throttledScroll = throttle(() => {
      if (!isScrolling) {
        handleScrollStart();
      }
      
      // Always do a partial update during scrolling
      // Get the window manager instance before using it
      const windowManager = DebugWindowManager.getInstance();
      if (windowManager && windowManager.isOpen()) {
        const currentPos = {
          scrollY: window.scrollY,
          scrollX: window.scrollX
        };
        
        const debugWindow = windowManager.getDebugWindow();
        if (debugWindow && !debugWindow.closed) {
          debugWindow.postMessage({
            type: 'DEBUG_SCROLL_UPDATE',
            position: currentPos,
            timestamp: Date.now()
          }, '*');
        }
      }
      
      // Reset the scroll end detection timer
      handleScrollEnd();
    }, 100);
    
     // Send initial viewport info
    updateViewportInfo();
    
    // Current DPR reference
    let currentDpr = window.devicePixelRatio || 1;
    
    // DPR change detection
    const dprMediaQuery = window.matchMedia(`(resolution: ${currentDpr}dppx)`);
    
    const handleDprChange = () => {
      const newDpr = window.devicePixelRatio || 1;
      if (Math.abs(newDpr - currentDpr) > 0.01) {
        currentDpr = newDpr;
        updateViewportInfo();
      }
    };
    
    // Add event listeners
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', updateViewportInfo);
    window.addEventListener('visibilitychange', updateViewportInfo);
    dprMediaQuery.addEventListener('change', handleDprChange);
    
    // For browsers that support Visual Viewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener('scroll', throttledScroll);
      window.visualViewport.addEventListener('resize', updateViewportInfo);
    }

    // Add listener for messages requesting viewport info
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data.type === 'REQUEST_VIEWPORT_INFO') {
        // Only send viewport info when explicitly requested
        updateViewportInfo();
      }
    };
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', updateViewportInfo);
      window.removeEventListener('visibilitychange', updateViewportInfo);
      window.removeEventListener('message', handleMessage);
      dprMediaQuery.removeEventListener('change', handleDprChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('scroll', throttledScroll);
        window.visualViewport.removeEventListener('resize', updateViewportInfo);
      }
      
      throttledScroll.cancel?.();
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [isActive, setViewportInfo, setDebugContent]);

  
  
  // Only collect data when debug is active
  useEffect(() => {
    // Skip if debug is off
    if (!isActive || !dimensions) return

    // Don't log during resize to reduce noise
    const windowManager = DebugWindowManager.getInstance()
    const isResizing = windowManager?.getResizeState() === 'resizing'
    
    if (!isResizing && windowRef.current) {
      log(`Debug observer updating data for ${componentId}`, {
        hasColorMap: !!colorMap?.length,
        hasElementMap: !!elementMap?.length,
        dimensions,
        image: !!image,
        optimizedImageUrl: !!optimizedImageUrl,
        viewportInfo,
        accessibility: elementColors ? {
          elements: Object.keys(elementColors).length,
          wcagCompliant: Object.values(elementColors).some(el => el.wcagCompliant),
          needsBackground: Object.values(elementColors).some(el => el.needsBackground),
          dpr: viewportInfo.dpr
        } : null
      })
    }

    // Calculate aspect ratios
    const calculatedAspectRatio = dimensions 
      ? dimensions.width / dimensions.height 
      : 0
      
    const sourceAspectRatio = image?.asset?.metadata?.dimensions 
      ? image.asset.metadata.dimensions.width / image.asset.metadata.dimensions.height
      : 0
      
    dataRef.current = {
      colorMap: colorMap || [],
      elementMap: elementMap || [],
      dimensions: dimensions || { width: 0, height: 0 },
      displayName,
      viewportInfo,
      ...(elementColors && { accessibilityResults: { elementColors } }),
      ...(image?.asset?.url && {
        imageDebug: {
          displayName,
          imageUrl: optimizedImageUrl || image.asset.url,
          renderInfo: {
            containerWidth: dimensions?.width || 0,
            containerHeight: dimensions?.height || 0,
            objectFit: 'cover',
            objectPosition: { 
              x: image?.hotspot?.x ?? 0.5, 
              y: image?.hotspot?.y ?? 0.5 
            },
            hotspot: image?.hotspot,
            debug: {
              calculatedAspectRatio,
              sourceAspectRatio,
              originalDimensions: image.asset.metadata?.dimensions ? {
                width: image.asset.metadata.dimensions.width,
                height: image.asset.metadata.dimensions.height,
                ...(image.asset.metadata.dimensions.aspectRatio && {
                  aspectRatio: image.asset.metadata.dimensions.aspectRatio
                })
              } : undefined
            }
          },
          screenDimensions: {
            width: viewportInfo.width,
            height: viewportInfo.height
          }
        }
      })
    }

    // Update debug content immediately if we have data and not resizing
    if (dataRef.current && !isResizing) {
      setDebugContent(dataRef.current as DebugContent)
      
      if (!isResizing) {
        log(`Debug content updated from ${componentId}`, {
          hasColorMap: !!colorMap?.length,
          hasElementMap: !!elementMap?.length,
          hasImage: !!image?.asset?.url,
          viewport: {
            scroll: `${viewportInfo.scrollX},${viewportInfo.scrollY}`,
            size: `${viewportInfo.width}x${viewportInfo.height}`,
            zoom: viewportInfo.zoomLevel
          }
        })
      }
    }
  }, [
    isActive,
    colorMap,
    elementMap,
    elementColors,
    image,
    optimizedImageUrl,
    dimensions,
    componentId,
    setDebugContent,
    displayName,
    log,
    viewportInfo
  ])
  
  // Force debug update after mount - only if debug is active
  useEffect(() => {
    // Skip if no debug mode or not enabled
    if (!isActive || !dimensions) return
    
    // Force an immediate update using current data if not resizing
    const windowManager = DebugWindowManager.getInstance()
    const isResizing = windowManager?.getResizeState() === 'resizing'
    
    if (dataRef.current && !isResizing) {
      log(`Sending initial debug data from ${componentId}`)
      setDebugContent(dataRef.current as DebugContent)
      
      // Store in window manager directly to ensure it's available
      if (windowManager) {
        windowManager.sendDebugUpdate(dataRef.current as DebugContent)
      }
    }
  }, [isActive, componentId, setDebugContent, dimensions, log])
  
  return { isActive }
}