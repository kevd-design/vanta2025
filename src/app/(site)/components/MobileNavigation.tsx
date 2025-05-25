'use client'

import { FC, useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useWindowSize } from '../hooks/useWindowSize'
import { useOptimizedImage } from '../hooks/useOptimizedImage'
import XButton from '../elements/XButton'
import { NavLink } from './common/NavLink'
import type { MobileNavigationProps } from '../../types'
import { DIMENSIONS } from '../constants'

export const MobileNavigation: FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  navigationItems,
  backgroundImage,
  lqip
}) => {

  // Animation state
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  // Refs for element mapping
  const containerRef = useRef<HTMLDivElement>(null)

  // Dimensions and screen size
  const { width: screenWidth } = useWindowSize()
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : null
  
  const dimensions = useMemo(() => ({
    width: Math.round(screenWidth || DIMENSIONS.screen.defaultWidth),
    height: Math.round(screenHeight || DIMENSIONS.screen.defaultHeight)
  }), [screenWidth, screenHeight])

  // Image and render info
  const { url: imageUrl, generateUrl, setUrl } = useOptimizedImage({
    asset: backgroundImage.asset ?? null,
    hotspot: backgroundImage.hotspot ?? null,
    crop: backgroundImage.crop ?? null,
    width: screenWidth,
    height: screenHeight ?? DIMENSIONS.screen.defaultHeight,
    quality: 70
  })



  // Effects
  useEffect(() => {
    const url = generateUrl()
    if (url) setUrl(url)
  }, [dimensions.width, dimensions.height, generateUrl, setUrl])
  
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setHasEntered(true)
      })
    } else {
      setHasEntered(false)
    }
  }, [isOpen])

  // Handlers
  const handleClose = () => {
    setIsAnimatingOut(true)
    setHasEntered(false)
    
    setTimeout(() => {
      setIsAnimatingOut(false)
      onClose()
    }, 300)
  }


  if (!imageUrl || (!isOpen && !isAnimatingOut)) return null

  return (
    <div 
      ref={containerRef}
      className={`
        fixed inset-0 z-50
        transition-opacity duration-300 ease-menu
        ${hasEntered ? 'opacity-100' : 'opacity-0'}
      `}
    >
      
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
      <div 
        className={`
          fixed inset-x-0 top-0 z-50
          transform transition-transform duration-300 ease-menu
          ${hasEntered ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        
        <div className="relative w-full max-h-[90vh] rounded-b-[32px] shadow-xl">
          {/* Background layer */}
          <div className="fixed inset-x-0 top-0 w-full h-full rounded-b-[32px] overflow-hidden">
            
            {imageUrl && backgroundImage?.asset && (
              <>
                <Image
                  src={imageUrl}
                  alt=""
                  priority
                  className="absolute inset-0 object-cover"
                  sizes="100vw"
                  placeholder={lqip ? "blur" : undefined}
                  blurDataURL={lqip}
                  fill
                />
                
              </>
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
        
      </div>
      
    </div>
  )
}