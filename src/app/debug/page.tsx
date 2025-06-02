'use client'

import { useState, useEffect, useRef } from 'react'
import { LoadingSpinner } from '@/app/elements/LoadingSpinner'
import './debug.css'
import { DebugProvider } from '@/debug'
import type { DebugContent } from '@/debug'
import { DebugLayoutProvider } from '@/debug'
import { DebugPanel } from '@/debug/components/DebugPanel'


export default function DebugPage() {
  const [content, setContent] = useState<DebugContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [connectionFailed, setConnectionFailed] = useState(false)
  const attemptsRef = useRef(0)
  const contentReceivedRef = useRef(false)
  const MAX_ATTEMPTS = 10

  // Add viewport state management
const [viewportInfo, setViewportInfo] = useState({
  scrollY: 0,
  scrollX: 0,
  width: 800,
  height: 600,
  zoomLevel: 1
});

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Basic validation
      if (!event.data) {
        console.log('Empty message received');
        return;
      }

      // Log the message type and format to diagnose issues
      console.log('Message received from:', event.origin);
      console.log('Message data type:', typeof event.data);
      
      try {
        // Log the raw data structure for debugging
        const dataKeys = typeof event.data === 'object' ? Object.keys(event.data) : [];
        console.log('Message data structure:', dataKeys);
        
        // First check if message has a direct type property
        if (typeof event.data === 'object' && event.data.type === 'DEBUG_UPDATE') {
          console.log('DEBUG_UPDATE message received directly');
          
          if (!event.data.content) {
            console.error('Missing content in DEBUG_UPDATE message');
            return;
          }
          
          // Set content and update UI
          const contentData = event.data.content;
          console.log('Debug content received:', {
            type: contentData.displayName,
            hasColorMap: Array.isArray(contentData.colorMap),
            hasElementMap: Array.isArray(contentData.elementMap)
          });
          
          // IMPORTANT: Mark that we've received content and immediately stop loading
          contentReceivedRef.current = true;
          
          // Use a try-catch to handle potential serialization issues
          try {
            // Make a deep clone to ensure we don't have reference issues
            const clonedContent = JSON.parse(JSON.stringify(contentData));
            console.log('Content received, updating loading state:', { 
              hasContent: true, 
              displayName: clonedContent.displayName 
            });
            
            // Force validity checks on critical fields to ensure the content is complete
            if (!clonedContent.dimensions) {
              clonedContent.dimensions = { width: 0, height: 0 };
            }
            if (!Array.isArray(clonedContent.colorMap)) {
              clonedContent.colorMap = [];
            }
            if (!Array.isArray(clonedContent.elementMap)) {
              clonedContent.elementMap = [];
            }
            if (!clonedContent.accessibilityResults) {
              clonedContent.accessibilityResults = { elementColors: {} };
            }
            
            setContent(clonedContent);
            setIsLoading(false);
            setInitialContentReady(true);
          } catch (err) {
            console.error('Error processing debug content:', err);
          }
          return;
        }
        
        // Add handler for viewport updates
        if (typeof event.data === 'object' && event.data.type === 'DEBUG_VIEWPORT_UPDATE') {
          if (event.data.viewportInfo) {
            console.log('Viewport update received:', event.data.viewportInfo);
            setViewportInfo(event.data.viewportInfo);
            
            // If we have content, update its viewport info
            setContent(prev => {
              if (prev) {
                return {
                  ...prev,
                  viewportInfo: event.data.viewportInfo
                };
              }
              return prev;
            });
          }
        }
        
        console.log('Unhandled message format:', event.data);
      } catch (err) {
        console.error('Error handling message:', err);
      }
    };

    
      
    window.addEventListener('message', handleMessage);
    
    // Ping parent to get latest content
    const pingParent = () => {
      attemptsRef.current += 1;
      console.log(`Debug window pinging parent window (attempt ${attemptsRef.current}/${MAX_ATTEMPTS})`);
      
      // Update UI state
      setConnectionAttempts(attemptsRef.current);
      
      // Check if we've reached the max attempts
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        console.log('Maximum connection attempts reached');
        setConnectionFailed(true);
        return false; // Return false to indicate we should stop pinging
      }
      
      // Create an explicit message object
      const readyMessage = {
        type: 'DEBUG_READY',
        timestamp: Date.now(),
        windowId: Math.random().toString(36).substring(2, 9)
      };
      
      // Check if parent window exists
      if (!window.opener) {
        console.warn('Cannot find parent window - debug window may have been opened directly');
        setConnectionFailed(true);
        return false;
      }
      
      try {
        // Send with explicit targetOrigin
        window.opener.postMessage(readyMessage, '*'); // Changed to * for broader compatibility
        console.log('Sent DEBUG_READY message to parent', readyMessage);
      } catch (err) {
        console.error('Error sending ready message:', err);
      }
      
      return true; // Continue pinging
    }
    
    // Initial ping
    pingParent()
    
    // Setup interval but clear it after MAX_ATTEMPTS
    let pingIntervalId: NodeJS.Timeout | null = setInterval(() => {
      // Stop pinging if we've received content
      if (contentReceivedRef.current) {
        console.log('Content received, stopping ping interval');
        if (pingIntervalId) {
          clearInterval(pingIntervalId);
          pingIntervalId = null;
        }
        return;
      }
      
      // If pingParent returns false, clear the interval
      if (!pingParent()) {
        if (pingIntervalId) {
          clearInterval(pingIntervalId)
          pingIntervalId = null
        }
      }
    }, 2000)
    
    // Cleanup function
    return () => {
      window.removeEventListener('message', handleMessage)
      if (pingIntervalId) clearInterval(pingIntervalId)
    }
  }, []) 

  useEffect(() => {
    // If we have content, immediately update loading state
    if (content) {
      setIsLoading(false);
      console.log('Content received, updating loading state:', { 
        hasContent: true, 
        displayName: content.displayName 
      });
      return; // Skip setting up timeout if we have content
    }
    
    console.log('Setting up loading timeout')
    const timeoutId = setTimeout(() => {
      console.log('Loading timeout reached after 5s')
      // Only update loading state if we haven't received content
      if (!contentReceivedRef.current) {
        setIsLoading(false)
      }
    }, 5000)
    
    return () => clearTimeout(timeoutId)
  }, [content])
  
  useEffect(() => {
    // Add this for better debugging
    console.log('Debug page content updated:', { 
      hasContent: !!content,
      contentKeys: content ? Object.keys(content) : [],
      receivedFlag: contentReceivedRef.current,
      isLoading
    })
  }, [content, isLoading])

  // Create a debug element state to guarantee rendering content once we have it
  const [initialContentReady, setInitialContentReady] = useState(false);
  
  useEffect(() => {
    // Once we have content and loading is done, mark as ready
    if (content && !isLoading) {
      setInitialContentReady(true);
    }
  }, [content, isLoading]);

  const [resizeState, setResizeState] = useState<'idle' | 'resizing' | 'completed'>('idle');

useEffect(() => {
  const handleResizeMessage = (event: MessageEvent) => {
    if (typeof event.data === 'object' && event.data.type === 'DEBUG_RESIZE_STATE') {
      console.log('Resize state update:', event.data.state);
      setResizeState(event.data.state);
    }
  };
  
  window.addEventListener('message', handleResizeMessage);
  return () => window.removeEventListener('message', handleResizeMessage);
}, []);

// Add a function to request viewport info only when the debug window is first loaded
useEffect(() => {
  // Request viewport info once when the debug window loads
  if (window.opener) {
    console.log("Debug window requesting initial viewport info");
    window.opener.postMessage({
      type: 'REQUEST_VIEWPORT_INFO'
    }, '*');
  }

  // No recurring requests, no click or scroll handlers needed
}, []);

  return (
    <DebugProvider>
      <DebugLayoutProvider initialContent={content}>
        {(!initialContentReady && (!contentReceivedRef.current || isLoading)) ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {!connectionFailed && <LoadingSpinner />}
            <div className="mt-4 text-sm text-gray-400">
              {connectionFailed ? 
                'Connection to main window failed' : 
                connectionAttempts > 3 ? 
                  'Having trouble connecting to main window...' : 
                  'Connecting to main window...'}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Attempt {connectionAttempts}/{MAX_ATTEMPTS}
            </div>
            {connectionFailed && (
              <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-md max-w-md">
                <h3 className="text-red-300 font-medium mb-2">Connection failed</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Could not connect to the main window after multiple attempts.
                </p>
                <div className="text-xs text-gray-400">
                  <p className="mb-1">Possible reasons:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>The main window was closed</li>
                    <li>Debug mode was deactivated</li>
                    <li>The connection was interrupted</li>
                  </ul>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => window.close()}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    Close Window
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <DebugPanel 
            key="debug-panel" 
            initialContent={content} 
            resizeState={resizeState}
            latestViewport={viewportInfo}
          />
        )}
      </DebugLayoutProvider>
    </DebugProvider>
  )
}