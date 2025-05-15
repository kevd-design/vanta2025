'use client'

import { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { usePathname } from 'next/navigation'
import XButton from '../elements/XButton'
import type { MobileNavigationProps } from '../../types'


export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  backgroundImageUrl,
  navigationItems,
  debugInfo,
  backgroundImage,
  lqip
}) => {
  // Set to true to enable debug info
  // This will show the image URL, width, and DPR in the bottom left corner
  // of the screen when the menu is open
  // Also shows the hotspot on the image if it exists
  // This is useful for debugging the image loading and hotspot positioning
  const enableDebug = false
  const { width: screenWidth } = useWindowSize()
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : null;
  const pathname = usePathname();
  
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  
  // Handle enter animation
  useEffect(() => {
    if (isOpen) {
      // Delay setting hasEntered to allow initial transform to be applied
      requestAnimationFrame(() => {
        setHasEntered(true);
      });
    } else {
      setHasEntered(false);
    }
  }, [isOpen]);

  // Handle exit animation
  const handleClose = () => {
    setIsAnimatingOut(true);
    setHasEntered(false);
    
    setTimeout(() => {
      setIsAnimatingOut(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimatingOut) return null;


  return (
    <div 
      className={`
        fixed inset-0 z-50
        transition-opacity duration-300 ease-menu
        ${hasEntered ? 'opacity-100' : 'opacity-0'}
      `}
    >
        {/* Overlay for closing menu */}
         <div
        className={`
          absolute inset-0 bg-black/20
          transition-opacity duration-300 ease-menu
          ${hasEntered ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleClose}
        aria-label="Close menu overlay"
      />
      
      {/* Menu container */}
       <div 
        className={`
          relative w-full h-[90vh] overflow-hidden rounded-b-[32px] shadow-xl
          transform transition-transform duration-300 ease-menu
          ${hasEntered ? 'translate-y-0' : '-translate-y-full'}
        `}
      >

        {/* Background layer */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt=""
            width={screenWidth}
            height={screenHeight || 0}
            priority
            className="w-full h-auto min-h-full object-cover"
            sizes="100vw"
            placeholder={lqip ? "blur" : undefined}
            blurDataURL={lqip}

          />
            {/* Emerald gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-800/90 to-emerald-800/0 pointer-events-none" />

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
          
        </div>
        {/* Content layer */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Menu header with backdrop blur */}
          <div className="flex items-center justify-between p-8 pt-12">
            <h2 className="text-2xl text-white">Menu</h2>
            <button
              onClick={handleClose}  // Change from onClose to handleClose
              className="p-2 text-white hover:text-gray-200"
              aria-label="Close menu"
            >
              <XButton />
            </button>
          </div>

          {/* Navigation links with improved visibility */}
          <div className="w-full flex items-start px-8 pb-40">
            <nav className="grid grid-cols-4 gap-x-8 gap-y-6 w-full max-w-lg">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`col-span-3 rounded-lg text-black text-center py-3 px-6 text-lg font-medium shadow transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400
                      ${isActive
                        ? 'bg-amber-100 pointer-events-none opacity-80'
                        : 'bg-emerald-100 hover:bg-amber-200'
                      }
                    `}
                    tabIndex={isActive ? -1 : 0}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={handleClose}
                  >
                    {item.label}
                  </Link>
                );
              })}
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