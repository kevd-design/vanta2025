'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'

interface NavigationItem {
  label: string
  href: string
}

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  backgroundImageUrl: string
  navigationItems: NavigationItem[]
  backgroundImage?: {
    asset: {
      metadata: {
        dimensions: {
          aspectRatio: number
          height: number
          width: number
        }
      }
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
    debugInfo?: {
    url: string
    width: number
    dpr: number
  }
}

export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  backgroundImageUrl,
  navigationItems,
  debugInfo,
  backgroundImage,
  
}) => {
  // Set to true to enable debug info
  // This will show the image URL, width, and DPR in the bottom left corner
  // of the screen when the menu is open
  // Also shows the hotspot on the image if it exists
  // This is useful for debugging the image loading and hotspot positioning
  const enableDebug = false
  const { width: screenWidth } = useWindowSize()

  if (!isOpen) return null

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="fixed inset-y-0 right-0 w-full h-screen overflow-hidden relative">
        {/* Background layer */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt="Menu background"
            width={screenWidth}
            height={window.innerHeight}
            priority
            className="w-full h-auto min-h-full object-cover"
            sizes="100vw"
            

          />
          {enableDebug && backgroundImage?.hotspot && (
            <div
              className="absolute z-30"
              style={{
                left: `${(1-backgroundImage.hotspot.x) * 100}%`,
                top: `${backgroundImage.hotspot.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />
            </div>
          )}
          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        {/* Content layer */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Menu header with backdrop blur */}
          <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-black/20">
            <h2 className="text-2xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-gray-200"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation links with improved visibility */}
          <div className="px-4 py-8 w-3/4">
            <nav className="space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 text-lg font-medium text-white hover:text-gray-200 transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {enableDebug && debugInfo && (
      <div className="absolute bottom-40 left-0 z-20 bg-black/70 text-white text-xs p-2 font-mono pointer-events-none break-all w-80 max-w-full">
        <div><b>Image URL:</b> {debugInfo.url}</div>
        <div><b>Width:</b> {debugInfo.width}px</div>
        <div><b>DPR:</b> {debugInfo.dpr}</div>
      </div>
)}
    </div>
  )
}