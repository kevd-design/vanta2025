'use client'

import { FC, useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { useOptimizedImage } from '../hooks/useOptimizedImage'
import XButton from '../elements/XButton'
import type { MobileNavigationProps } from '../../types'
import { DIMENSIONS } from '../constants'
import { NavLink } from './common/NavLink'


export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
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
  
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  const dimensions = useMemo(() => ({
    width: Math.round(screenWidth || DIMENSIONS.screen.defaultWidth),
    height: Math.round(screenHeight || DIMENSIONS.screen.defaultHeight)
  }), [screenWidth, screenHeight])

  const { url: imageUrl, generateUrl, setUrl } = useOptimizedImage({
    asset: backgroundImage?.asset ?? null,
    hotspot: backgroundImage?.hotspot ?? null,
    width: dimensions.width,
    height: dimensions.height
  })

    useEffect(() => {
    const url = generateUrl()
    if (url) setUrl(url)
  }, [dimensions.width, dimensions.height, generateUrl, setUrl])
  
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



   if (!imageUrl || (!isOpen && !isAnimatingOut)) return null


  return (
    <div className={`
    fixed inset-0 z-50
    transition-opacity duration-300 ease-menu
    ${hasEntered ? 'opacity-100' : 'opacity-0'}
  `}>
    {/* Overlay */}
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
    <div className={`
      fixed inset-x-0 top-0 z-50
      transform transition-transform duration-300 ease-menu
      ${hasEntered ? 'translate-y-0' : '-translate-y-full'}
    `}>
      <div className="relative w-full max-h-[90vh] rounded-b-[32px] shadow-xl">
    
    {/* Background layer */}
        <div className="fixed inset-x-0 top-0 w-full h-full rounded-b-[32px] overflow-hidden">
            {imageUrl && backgroundImage?.asset && (
              <Image
                src={imageUrl}
                alt=""
                priority
                className="absolute inset-0 object-cover"
                style={{
                  objectPosition: backgroundImage?.hotspot
                    ? `${backgroundImage.hotspot.x * 100}% ${backgroundImage.hotspot.y * 100}%`
                    : '50% 50%'
                }}
                sizes="100vw"
                placeholder={lqip ? "blur" : undefined}
                blurDataURL={lqip}
                fill
              />
            )}

            {enableDebug && backgroundImage?.hotspot && (
              <div
                style={{
                  left: `${backgroundImage.hotspot.x * 100}%`,
                  top: `${backgroundImage.hotspot.y * 100}%`
                }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 w-full h-full rounded-b-[32px] bg-gradient-to-r from-emerald-800/90 via-emerald-800/80 to-transparent" />
          </div>
        
        {/* Scrollable content */}
        <div className="relative z-10 max-h-[90vh] overflow-y-auto">
          {/* Menu header */}
          <div className="flex items-center justify-between p-8 pt-12">
            <h2 className="text-2xl text-white">Menu</h2>
            <button
              onClick={handleClose}
              className="p-2 text-white hover:text-gray-200 cursor-pointer"
              aria-label="Close menu"
            >
              <XButton />
            </button>
          </div>

          {/* Navigation links */}
          <div className="px-12 pt-20 pb-12">
          <nav className="grid grid-cols-4 gap-4 w-full max-w-lg mx-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                variant="mobile"
                onClick={handleClose}
                />
              ))}
          </nav>
          </div>
        </div>
      </div>
      {/* Debug info */}
    

     
      {enableDebug && debugInfo && (
      <div className="absolute bottom-40 left-0 z-20 bg-black/70 text-white text-xs p-2 font-mono pointer-events-none break-all w-80 max-w-full">
        <div><b>Image URL:</b> {debugInfo.url}</div>
        <div><b>Width:</b> {debugInfo.width}px</div>
        <div><b>DPR:</b> {debugInfo.dpr}</div>
        
      </div>
)}
      </div>
      
    </div>
  )
}