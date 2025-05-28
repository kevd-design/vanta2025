'use client'

import { FC, useEffect, useState } from 'react'
import { useDebug } from '../../context/DebugContext'
import { DebugWindowManager } from '../../utils/debugWindowManager'

export const DebugStatus: FC = () => {
  // Use useState to handle client-side rendering properly
  const [isMounted, setIsMounted] = useState(false)
  const { isDebugMode, toggleDebugMode } = useDebug()
  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  
  // Automatically hide the debug indicator when debug mode is disabled
  useEffect(() => {
    // Always show when debug is on
    if (isDebugMode) {
      setIsVisible(true);
      return;
    }
    
    // When debug mode is turned off, hide after a delay
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 2 second delay
    
    return () => clearTimeout(timer);
  }, [isDebugMode]);
  
  // Only run after component mounts on the client
  useEffect(() => {
    setIsMounted(true)
    
    // Check window status every second
    const checkWindowInterval = setInterval(() => {
      const windowManager = DebugWindowManager.getInstance()
      setIsWindowOpen(!!windowManager?.isOpen())
    }, 1000)
    
    return () => clearInterval(checkWindowInterval)
  }, [])
  
  // Don't render anything during SSR
  if (!isMounted) return null
  
  // Don't render anything when debug is off and indicator should be hidden
  if (!isDebugMode && !isVisible) return null
  
  const handleOpenDebug = () => {
    const windowManager = DebugWindowManager.getInstance()
    if (windowManager) {
      windowManager.openDebugWindow()
    }
  }

  const sendTestMessage = () => {
    const windowManager = DebugWindowManager.getInstance()
    if (windowManager && windowManager.isOpen()) {
      // Send a simple test message
      const testWindow = windowManager.getDebugWindow();
      if (testWindow) {
        console.log('Sending test message');
        testWindow.postMessage({
          type: 'DEBUG_UPDATE',
          content: { 
            displayName: 'Test Message',
            colorMap: [],
            elementMap: [],
            dimensions: {width: 100, height: 100},
            accessibilityResults: {elementColors: {}}
          }
        }, '*');
      }
    }
  }
  
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <div 
        onClick={toggleDebugMode}
        className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer shadow-md flex items-center gap-2 ${
          isDebugMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
        } transition-opacity duration-300`}
      >
        <span>Debug: {isDebugMode ? 'ON' : 'OFF'}</span>
      </div>
      
      {isDebugMode && (
        <>
          <div 
            onClick={handleOpenDebug}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer shadow-md flex items-center gap-2"
          >
            <span>{isWindowOpen ? 'Debug Window Open' : 'Open Debug Window'}</span>
            {!isWindowOpen && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            )}
          </div>
          
          {isWindowOpen && (
            <div 
              onClick={sendTestMessage}
              className="bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer shadow-md flex items-center gap-2"
            >
              <span>Send Test Message</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}