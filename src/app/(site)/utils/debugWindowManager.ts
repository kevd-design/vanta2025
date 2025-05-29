'use client'

import type { DebugContent } from '../context/DebugLayoutContext'
import { DebugStorage } from './debugStorage'
import { throttle } from './throttle'

// Add ResizeState type to track resize status
type ResizeState = 'idle' | 'resizing' | 'completed';

export class DebugWindowManager {
  private static instance: DebugWindowManager
  private debugWindow: Window | null = null
  private readonly DEBUG_URL = '/debug'
  private latestContent: DebugContent | null = null
  private windowCheckInterval: NodeJS.Timeout | null = null
  private resizeState: ResizeState = 'idle'
  private resizeTimer: NodeJS.Timeout | null = null
  private resizeThrottleTimeout: NodeJS.Timeout | null = null
  private resizeCount = 0
  private onWindowClosed: (() => void) | null = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for messages from debug window
      window.addEventListener('message', (event) => {
        // Only log in debug mode
        const isDebugModeActive = localStorage.getItem('debug-mode') === 'true';
        
        if (isDebugModeActive) {
          console.log('Main window received message:', 
                    typeof event.data === 'object' ? event.data.type : 'unknown format');
        }
        
        // Handle viewport request directly here instead of adding new listeners
        if (typeof event.data === 'object' && event.data.type === 'REQUEST_VIEWPORT_INFO') {
          this.sendViewportInfo();
        }
        
        if (typeof event.data === 'object' && event.data.type === 'DEBUG_READY') {
          // ...existing code...
        }
      });
      
      // Handle window resize events
      this.setupResizeListener();
      
      // Start monitoring window status
      this.startWindowCheck();
    }
  }
  

  // Update sendViewportInfo function:
  private sendViewportInfo() {
  if (!this.debugWindow || this.debugWindow.closed) return;

  // Get the SEPARATE values for DPR and zoom
  const dpr = window.devicePixelRatio || 1;
  const zoomLevel = window.visualViewport?.scale || 1;
  
  const viewportInfo = {
    scrollY: window.scrollY,
    scrollX: window.scrollX,
    width: window.innerWidth,
    height: window.innerHeight,
    zoomLevel, // Browser zoom level from visualViewport
    dpr       // Device pixel ratio
  };
  
  try {
    this.debugWindow.postMessage({
      type: 'DEBUG_VIEWPORT_UPDATE',
      viewportInfo
    }, '*');
  } catch (err) {
    console.error('Error sending viewport info:', err);
  }
}

  private setupResizeListener() {
    // Throttled resize handler
    const handleResize = throttle(() => {
      // Don't do anything if debug mode is off or no debug window
      if (localStorage.getItem('debug-mode') !== 'true' || !this.debugWindow || this.debugWindow.closed) {
        return;
      }
      
      // If we were already in resizing state, just update counter
      if (this.resizeState === 'resizing') {
        this.resizeCount++;
        
        // Clear any previous completion timer
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer);
        }
      } else {
        // First resize event, switch to resizing state
        this.resizeState = 'resizing';
        this.resizeCount = 1;
        
        // Notify debug window about resize state
        if (this.debugWindow && !this.debugWindow.closed) {
          this.debugWindow.postMessage({
            type: 'DEBUG_RESIZE_STATE',
            state: 'resizing'
          }, '*');
        }
      }
      
      // Set a timer to detect when resizing is likely complete
      this.resizeTimer = setTimeout(() => {
        // Only update if we're still in resizing state
        if (this.resizeState === 'resizing') {
          this.resizeState = 'completed';
          
          // Notify debug window that resize is complete
          if (this.debugWindow && !this.debugWindow.closed) {
            this.debugWindow.postMessage({
              type: 'DEBUG_RESIZE_STATE',
              state: 'completed',
              resizeCount: this.resizeCount
            }, '*');
          }
          
          // IMPORTANT: Capture the current viewport dimensions after resize is complete
          const currentViewportInfo = {
            scrollY: window.scrollY,
            scrollX: window.scrollX,
            width: window.innerWidth,
            height: window.innerHeight,
            zoomLevel: window.visualViewport?.scale || 1, // Separate from DPR
            dpr: window.devicePixelRatio || 1 
          };
          
          // Send updated viewport info immediately after resize completes
          if (this.debugWindow && !this.debugWindow.closed) {
            this.debugWindow.postMessage({
              type: 'DEBUG_VIEWPORT_UPDATE',
              viewportInfo: currentViewportInfo
            }, '*');
          }
          
          // Resend the latest content after a longer delay to allow UI to fully stabilize
          setTimeout(() => {
            if (this.latestContent && this.debugWindow && !this.debugWindow.closed) {
              // Update the latest content with the current viewport info
              const updatedContent = {
                ...this.latestContent,
                viewportInfo: currentViewportInfo
              };
              
              // Store the updated content
              this.latestContent = updatedContent;
              
              // Send the updated content
              this.sendDebugUpdate(updatedContent);
            }
          }, 400);
          
          // Reset counter for next resize
          this.resizeCount = 0;
        }
      }, 1000);  // 1 second delay to ensure resize is truly complete
    }, 250);  // Throttle to 250ms for smoother updates
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
  }
  
private startWindowCheck() {
  // Clear any existing interval
  if (this.windowCheckInterval) {
    clearInterval(this.windowCheckInterval)
  }
  
  // Check less frequently - every 3 seconds is sufficient for most use cases
  this.windowCheckInterval = setInterval(() => {
    // Only do work if we actually have a debug window reference
    if (this.debugWindow) {
      // Check if the window has been closed
      if (this.debugWindow.closed) {
        // Do cleanup only when necessary
        this.debugWindow = null
        
        // Call the onWindowClosed callback if defined
        if (this.onWindowClosed) {
          this.onWindowClosed();
        }
        
        // Auto-disable debug mode when window is closed
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('debug-mode', 'false');
          window.dispatchEvent(new CustomEvent('debug-mode-changed', 
            { detail: { isActive: false } }));
        }
        
        // Stop checking once window is detected as closed
        if (this.windowCheckInterval) {
          clearInterval(this.windowCheckInterval);
          this.windowCheckInterval = null;
        }
      }
    } else {
      // No debug window reference, no need to keep checking
      if (this.windowCheckInterval) {
        clearInterval(this.windowCheckInterval);
        this.windowCheckInterval = null;
      }
    }
  }, 3000) // Increased from 1000ms to 3000ms
}
  
  /**
   * Set a callback function to be called when the debug window is closed
   */
  setOnWindowClosed(callback: () => void) {
    this.onWindowClosed = callback;
  }
  
  static getInstance() {
    if (typeof window === 'undefined') return null
    
    if (!this.instance) {
      this.instance = new DebugWindowManager()
    }
    return this.instance
  }

  openDebugWindow() {
    try {
      if (this.debugWindow && !this.debugWindow.closed) {
        this.debugWindow.focus()

        // Send fresh viewport info when focusing existing window
        setTimeout(() => this.sendViewportInfo(), 100);

      } else {
        this.debugWindow = window.open(
          this.DEBUG_URL,
          'debug-panel',
          'width=800,height=900,right=0,top=0'
        );
        
        // Check if window was blocked
        if (!this.debugWindow) {
          console.warn('Debug window was blocked. Please allow pop-ups for this site.')
          return null
        }

        // Send viewport info once window is likely ready
        setTimeout(() => this.sendViewportInfo(), 500);
      }
      return this.debugWindow
    } catch (err) {
      const isDebugModeActive = localStorage.getItem('debug-mode') === 'true';
      if (isDebugModeActive) {
        console.error('Error opening debug window:', err)
      }
      return null
    }
  }



  private latestContentHash: string = ''

  sendDebugUpdate(content: DebugContent | null) {

    // Don't send updates while resizing
    if (this.resizeState === 'resizing') {
      // Just store the content for later
      if (content) {
        this.latestContent = content;
        DebugStorage.setDebugData(content);
      }
      return;
    }
    
    // Skip if no content
    if (!content) {
      const isDebugModeActive = localStorage.getItem('debug-mode') === 'true';
      if (isDebugModeActive) {
        console.warn('No debug content to send');
      }
      return;
    }
    
    // Store in global storage
    DebugStorage.setDebugData(content);
    
    // Store content regardless of window state
    this.latestContent = content;
    
    const isDebugModeActive = localStorage.getItem('debug-mode') === 'true';
    

    
    // Only send if window exists and is open
    if (this.debugWindow && !this.debugWindow.closed && isDebugModeActive) {
      if (isDebugModeActive) {
        console.log('Sending debug update to window:', {
          hasContent: true,
          displayName: content.displayName || 'unknown',
          hasColorMap: Array.isArray(content.colorMap) && content.colorMap.length > 0,
          hasElementMap: Array.isArray(content.elementMap) && content.elementMap.length > 0,
          hasImageDebug: !!content.imageDebug,
          hasAccessibilityData: !!content.accessibilityResults,
          wcagCompliant: content.accessibilityResults ? 
          Object.values(content.accessibilityResults.elementColors).some(el => el.wcagCompliant) : false,
        dpr: content.viewportInfo?.dpr || window.devicePixelRatio || 1
        });
      }
      
      try {
        // IMPORTANT: Use a much simpler message format to avoid serialization issues
        const simpleMessage = {
          type: 'DEBUG_UPDATE',
          content: content,
          timestamp: Date.now()
        };
        
        // Explicitly using JSON to validate and log any failures
        try {
          const serializedContent = JSON.stringify(simpleMessage);
          if (isDebugModeActive) {
            console.log(`Serialized message size: ${serializedContent.length} bytes`);
          }
        } catch (jsonError) {
          if (isDebugModeActive) {
            console.error('Failed to serialize debug content:', jsonError);
          }
          return; // Don't attempt to send if can't serialize
        }
        
        // Send in the simplest way possible
        setTimeout(() => {
          if (this.debugWindow && !this.debugWindow.closed) {
            if (isDebugModeActive) {
              console.log('Posting message to debug window');
            }
            this.debugWindow.postMessage({
              type: 'DEBUG_UPDATE',
              content: content
            }, '*'); // Use * for origin to ensure delivery
          }
        }, 100);
      } catch (err) {
        if (isDebugModeActive) {
          console.error('Error sending debug content:', err);
        }
      }
    }
  }

  closeDebugWindow() {
    if (this.debugWindow) {
      this.debugWindow.close()
      this.debugWindow = null
    }
    
    if (this.windowCheckInterval) {
      clearInterval(this.windowCheckInterval)
      this.windowCheckInterval = null
    }
  }
  
  isOpen() {
    return !!this.debugWindow && !this.debugWindow.closed
  }

  getDebugWindow(): Window | null {
    return this.debugWindow;
  }
  
  getResizeState(): ResizeState {
    return this.resizeState;
  }
}