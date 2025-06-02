'use client'

import { FC, useEffect, useState, useRef } from 'react'
import { AccessibilityDebug } from './AccessibilityDebug'
import { ImageDebug } from './ImageDebug'
import { useDebugLayout } from '@/debug'
import type { DebugContent } from '@/debug'
import type { Viewport } from '@/app/lib/types/layout'

// Add viewport state to the component
interface DebugPanelProps {
  initialContent?: DebugContent | null;
  resizeState?: 'idle' | 'resizing' | 'completed';
  latestViewport?: Viewport; // Add this
}

export const DebugPanel: FC<DebugPanelProps> = ({ 
  initialContent, 
  resizeState = 'idle',
  latestViewport 
}) => {
  const { debugContent } = useDebugLayout()
  const [initialized, setInitialized] = useState(!!initialContent)
  const [localContent, setLocalContent] = useState<DebugContent | null>(initialContent || null)
  const [showDebugVisuals, setShowDebugVisuals] = useState(true)
  const [resizeInfo, setResizeInfo] = useState<{ count?: number; timestamp?: number }>({})
  const [scrollState, setScrollState] = useState<'idle' | 'scrolling' | 'completed'>('idle');
  const latestViewportRef = useRef<Viewport | null>(null);
  const [viewportUpdateCount, setViewportUpdateCount] = useState(0)
  const viewportUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-hide debug visuals after a delay if not in debug mode
  useEffect(() => {
    // Check if we're in the debug window
    const isDebugWindow = window.location.pathname === '/debug';
    
    // Skip auto-hiding if in debug window
    if (isDebugWindow) return;
    
    // Check debug mode status
    const isDebugMode = localStorage.getItem('debug-mode') === 'true';
    
    // Set initial state based on debug mode
    setShowDebugVisuals(isDebugMode);
    
    if (!isDebugMode) {
      // Hide debug visuals after a delay
      const timer = setTimeout(() => {
        setShowDebugVisuals(false);
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for resize state messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data.type === 'DEBUG_RESIZE_STATE') {
        // Track resize count and timestamp for debugging
        setResizeInfo({
          count: event.data.resizeCount,
          timestamp: Date.now()
        });
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Listen for scroll state messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data.type === 'DEBUG_SCROLL_STATE') {
        setScrollState(event.data.state);
        
        // Auto-reset to idle after completed (for UI feedback)
        if (event.data.state === 'completed') {
          setTimeout(() => setScrollState('idle'), 800);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Initial setup from props
  useEffect(() => {
    if (initialContent && !localContent) {
      try {
        setLocalContent(JSON.parse(JSON.stringify(initialContent)));
        setInitialized(true);
      } catch (err) {
        console.error('Error setting initial content:', err);
      }
    }
  }, [initialContent, localContent]);

  // Update from context (only when not resizing)
  useEffect(() => {
    // Skip updates during resize to improve performance
    if (resizeState === 'resizing') return;
    
    if (debugContent) {
      setInitialized(true)
      try {
        // Store valid content in local state with a defensive deep clone
        setLocalContent(JSON.parse(JSON.stringify(debugContent)))
      } catch (err) {
        console.error('Error cloning debug content:', err);
      }
    }
  }, [debugContent, resizeState])

  // Track viewport updates
  useEffect(() => {
    if (latestViewport) {
      // Store latest viewport in ref
      latestViewportRef.current = latestViewport;
      
      // Only trigger state update if it's meaningfully different
      setLocalContent(prev => {
        if (!prev) return prev;
        
        const currentInfo = prev.viewportInfo;
        if (currentInfo &&
            currentInfo.scrollX === latestViewport.scrollX &&
            currentInfo.scrollY === latestViewport.scrollY &&
            currentInfo.width === latestViewport.width &&
            currentInfo.height === latestViewport.height &&
            currentInfo.zoomLevel === latestViewport.zoomLevel) {
          return prev;
        }
        
        return {
          ...prev,
          viewportInfo: latestViewport
        };
      });
    }
  }, [latestViewport]);

  // Track viewport updates with debouncing
  const updateContentWithViewport = (viewport: Viewport) => {
    setLocalContent(prev => {
      if (!prev) return prev

      // Use meaningful thresholds to avoid unnecessary updates
      const significantScrollChange = 5; // 5px threshold for scroll changes
      const significantZoomChange = 0.05; // 5% threshold for zoom changes
    
    // Skip update if change is insignificant
    if (prev.viewportInfo &&
        Math.abs((prev.viewportInfo.scrollY || 0) - (viewport.scrollY || 0)) < significantScrollChange &&
        Math.abs((prev.viewportInfo.scrollX || 0) - (viewport.scrollX || 0)) < significantScrollChange &&
        prev.viewportInfo.width === viewport.width &&
        prev.viewportInfo.height === viewport.height &&
        Math.abs(prev.viewportInfo.zoomLevel - viewport.zoomLevel) < significantZoomChange) {
      return prev
    }
      
      // Create new content with updated viewport
      return {
        ...prev,
        viewportInfo: viewport
      }
    })
    
    // Track update count for debugging
    setViewportUpdateCount(c => c + 1)
  }

  // Handle viewport updates in message events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data.type === 'DEBUG_VIEWPORT_UPDATE') {
        const newViewport = event.data.viewportInfo
        
        // Store immediately in ref for quick access
        latestViewportRef.current = newViewport
        
        // Debounce actual state updates to avoid too many renders
        if (viewportUpdateTimeoutRef.current) {
          clearTimeout(viewportUpdateTimeoutRef.current)
        }
        
        viewportUpdateTimeoutRef.current = setTimeout(() => {
          updateContentWithViewport(newViewport)
          viewportUpdateTimeoutRef.current = null
        }, 100)
      }
      
      // Handle scroll position updates separately (more frequent)
      if (typeof event.data === 'object' && event.data.type === 'DEBUG_SCROLL_UPDATE') {
        // Just update scroll position without triggering renders
        const position = event.data.position
        if (latestViewportRef.current && position) {
          latestViewportRef.current.scrollX = position.scrollX
          latestViewportRef.current.scrollY = position.scrollY
        }
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      if (viewportUpdateTimeoutRef.current) {
        clearTimeout(viewportUpdateTimeoutRef.current)
      }
    }
  }, [])

  // Also keep track of provided viewport info from props
  useEffect(() => {
    if (latestViewport) {
      latestViewportRef.current = latestViewport
      updateContentWithViewport(latestViewport)
    }
  }, [latestViewport]);

  // Track resize state in the component
  useEffect(() => {
    console.log(`Resize state changed to: ${resizeState}`);
    
    // When resize completes, request fresh viewport info
    if (resizeState === 'completed') {
      // Make a request for updated viewport info
      if (window.opener) {
        try {
          window.opener.postMessage({
            type: 'REQUEST_VIEWPORT_INFO'
          }, '*');
          console.log('Requested fresh viewport info after resize');
        } catch (err) {
          console.error('Error requesting viewport info:', err);
        }
      }
    }
  }, [resizeState]);

  // Show resize state overlay when resizing
  if (resizeState === 'resizing') {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Window Resizing</h2>
        <p className="text-gray-400">Updates paused until resizing completes</p>
        {resizeInfo.count && (
          <p className="text-gray-500 mt-2 text-sm">Resize events: {resizeInfo.count}</p>
        )}
        {localContent && (
          <p className="text-gray-500 mt-4 text-sm">Last component: {localContent.displayName}</p>
        )}
      </div>
    );
  }

  // If we've never had content, show the no data message
  if (!initialized && !localContent) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-lg font-medium text-red-300 mb-2">No debug data available</h2>
          <p className="text-white text-sm mb-4">
            Debug data should be sent from the main window but none was received.
          </p>
          <div className="text-xs text-gray-400 text-left mb-4">
            <p className="mb-1">Possible reasons:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>No debug-enabled components are rendered in the main window</li>
              <li>Communication between windows failed</li>
              <li>Debug data is in an invalid format</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // If we've had content before but it's currently null, show a temporary loading
  if (initialized && !localContent && !debugContent) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">Waiting for debug data update...</p>
      </div>
    )
  }

  // Use the local content if available, fall back to debugContent, then initialContent
  const contentToDisplay = localContent || debugContent || initialContent;
  
  if (!contentToDisplay) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-orange-900/30 border border-orange-800 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-lg font-medium text-orange-300 mb-2">Debug content issue</h2>
          <p className="text-white text-sm mb-4">
            {`Content was received but couldn't be displayed.`}
          </p>
          <div className="text-xs text-gray-400 mb-4">
            <p>Check browser console for more details.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Always render the panel if we have either local or context content
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <nav className="border-b border-gray-800 py-4 px-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-50 flex justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Debug Panel: {contentToDisplay?.displayName || 'Debug Data'}</h1>
        </div>
        <div className="flex items-center">
          {resizeState === 'completed' && (
            <span className="text-green-400 text-sm animate-pulse mr-4">Update Complete</span>
          )}
          {scrollState === 'scrolling' && (
            <span className="text-blue-400 text-sm animate-pulse mr-4">Scrolling</span>
          )}
          {scrollState === 'completed' && (
            <span className="text-green-400 text-sm animate-pulse mr-4">Scroll Complete</span>
          )}
          <button 
            className={`px-3 py-1 rounded text-xs ${showDebugVisuals ? 'bg-blue-600' : 'bg-gray-600'}`}
            onClick={() => setShowDebugVisuals(prev => !prev)}
          >
            Visuals: {showDebugVisuals ? 'ON' : 'OFF'}
          </button>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-8">
          {/* Image Analysis */}
          {showDebugVisuals && contentToDisplay?.imageDebug && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Image Analysis</h2>
              <ImageDebug 
                displayName={contentToDisplay.imageDebug.displayName || "Image Analysis"}
                imageUrl={contentToDisplay.imageDebug.imageUrl}
                renderInfo={contentToDisplay.imageDebug.renderInfo}
                screenDimensions={contentToDisplay.imageDebug.screenDimensions}
              />
            </section>
          )}

          {/* Accessibility Map */}
          {showDebugVisuals && contentToDisplay?.colorMap && contentToDisplay?.elementMap && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Accessibility Analysis</h2>
              <AccessibilityDebug 
                colorMap={contentToDisplay.colorMap}
                elementMap={contentToDisplay.elementMap}
                dimensions={contentToDisplay.dimensions}
                accessibilityResults={contentToDisplay.accessibilityResults}
                screenDimensions={
                  contentToDisplay.viewportInfo ? 
                  {
                    width: contentToDisplay.viewportInfo.width,
                    height: contentToDisplay.viewportInfo.height
                  } : 
                  {
                    width: window.innerWidth,
                    height: window.innerHeight
                  }
                }
                imageUrl={contentToDisplay.imageDebug?.imageUrl}
                viewportInfo={contentToDisplay.viewportInfo}
                scrollState={scrollState} // Pass the scroll state
              />
            </section>
          )}

          {/* Raw Data - always show this regardless of visualizations setting */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Raw Debug Data</h2>
            <div className="bg-gray-800/50 rounded-lg p-4 overflow-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(contentToDisplay, null, 2)}
              </pre>
            </div>
          </section>

          {/* Debugging information section */}
          <div className="mt-4 p-2 bg-gray-800/30 rounded text-xs text-gray-400">
            <h3 className="font-medium text-gray-300 mb-1">Debug Info</h3>
            <div className="flex gap-4">
              <div>
                <span>Viewport updates: </span>
                <span className="text-white">{viewportUpdateCount}</span>
              </div>
              <div>
                <span>Scroll position: </span>
                <span className="text-white">
                  {latestViewportRef.current ? 
                    `${Math.round(latestViewportRef.current.scrollY)}px` : 
                    'unknown'}
                </span>
              </div>
              <div>
                <span>Last update: </span>
                <span className="text-white">
                  {contentToDisplay?.viewportInfo ? 
                    new Date().toLocaleTimeString() : 
                    'never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}