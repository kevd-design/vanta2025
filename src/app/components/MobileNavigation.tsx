'use client'

import { FC, useState, useEffect } from 'react'
import XButton from '@/app/elements/XButton'
import { NavLink } from '@/app/components/common/NavLink'
import { ImageContainer } from '@/app/components/common/ImageContainer'
import { MobileNavigationBackground } from '@/app/components/MobileNavigationBackground'
import type { MobileNavigationProps } from '@/app/lib/types/components/navigation'

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
  
  // Effects
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

  if (!isOpen && !isAnimatingOut) return null

  return (
    <div 
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
            <ImageContainer 
              className="w-full h-full"
            >
              {({ dimensions, setOptimizedImageUrl }) => (
                <MobileNavigationBackground
                  backgroundImage={backgroundImage}
                  dimensions={dimensions}
                  lqip={lqip}
                  setOptimizedImageUrl={setOptimizedImageUrl}
                />
              )}
            </ImageContainer>
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