'use client'

import { FC, useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Hamburger from '../elements/Hamburger'
import { Logo } from './Logo'
import { MobileNavigation } from './MobileNavigation'
import { useWindowSize } from '../hooks/useWindowSize'
import { debounce } from 'lodash'
import { useBestDpr } from '../hooks/useBestDpr'
import { useIsMobile } from '../hooks/useIsMobile'
import { useUrlCache } from '../hooks/useUrlCache'
import { DIMENSIONS, getNearestBreakpoint, IMAGE_OPTIONS } from '../constants'
import type { LogoType, NavLabelsType, MobileBackgroundImageType } from '../../types'

const { 
  defaultWidth: DEFAULT_SCREEN_WIDTH, 
  defaultHeight: DEFAULT_SCREEN_HEIGHT 
} = DIMENSIONS.screen

interface NavigationProps {
  logo: LogoType
  navLabels: NavLabelsType
  mobileBackgroundImage?: MobileBackgroundImageType
}

export const Navigation: FC<NavigationProps> = ({ logo, navLabels, mobileBackgroundImage }) => {
  
  
  // Window and Screen Hooks
  const isMobile = useIsMobile()
  const { width: screenWidth } = useWindowSize()
  const { height: screenHeight } = useWindowSize()
  const { generateCachedUrl } = useUrlCache()
  const dpr = useBestDpr()
  
  

  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [optimizedBackgroundUrl, setOptimizedBackgroundUrl] = useState('')
  const [lastBreakpoint, setLastBreakpoint] = useState<number | null>(null)
  const [currentBreakpoint, setCurrentBreakpoint] = useState<number>(() => 
    getNearestBreakpoint(screenWidth || DEFAULT_SCREEN_WIDTH)
  )

  // Memoized Values
  const navigationItems = useMemo(() => [
    { label: navLabels.homePageNavLabel, href: '/' },
    { label: navLabels.projectsPageNavLabel, href: '/projects' },
    { label: navLabels.aboutPageNavLabel, href: '/about' },
    { label: navLabels.reviewsPageNavLabel, href: '/reviews' },
    { label: navLabels.contactPageNavLabel, href: '/contact' },
  ], [navLabels])

    

  

  // Screen Size Callbacks
  const getBestScreenWidth = useCallback(() => 
    screenWidth || DEFAULT_SCREEN_WIDTH, [screenWidth])

  const getBestScreenHeight = useCallback(() => 
    screenHeight || DEFAULT_SCREEN_HEIGHT, [screenHeight])

const generateBackgroundUrl = useCallback((width: number, height: number) => {
    if (!isMobile || !mobileBackgroundImage?.asset) return '';
    
  return generateCachedUrl(
    mobileBackgroundImage.asset,
    width,
    height,
    {
      quality: IMAGE_OPTIONS.quality.medium,
      dpr,
      hotspot: mobileBackgroundImage.hotspot 
        ? { x: mobileBackgroundImage.hotspot.x, y: mobileBackgroundImage.hotspot.y }
        : undefined
    }
  );
}, [mobileBackgroundImage, dpr, generateCachedUrl, isMobile]);

 // Only initialize mobile-specific state and hooks if mobile
  const mobileNavigation = useMemo(() => {
    if (!isMobile) return null
    
    return {
      backgroundUrl: optimizedBackgroundUrl,
      updateUrl: generateBackgroundUrl,
      // ... other mobile-specific logic
    }
  }, [isMobile, optimizedBackgroundUrl, generateBackgroundUrl])


  // Debug Information
  const debugInfo = useMemo(() => ({
    url: optimizedBackgroundUrl,
    width: getBestScreenWidth(),
    dpr: dpr,
  }), [optimizedBackgroundUrl, getBestScreenWidth, dpr])

  // Background URL Generation
const updateBackgroundUrl = useMemo(
  () =>
    debounce(() => {
      if (!isMobile || !screenWidth || !mobileBackgroundImage) return;
      
      const bestWidth = getNearestBreakpoint(getBestScreenWidth());
      if (lastBreakpoint === bestWidth) return;
      
      setLastBreakpoint(bestWidth);
      const imageUrl = generateBackgroundUrl(bestWidth, getBestScreenHeight());
      setOptimizedBackgroundUrl(imageUrl);
    }, IMAGE_OPTIONS.debounce.wait),
  [isMobile, screenWidth, mobileBackgroundImage, getBestScreenWidth, getBestScreenHeight, lastBreakpoint, generateBackgroundUrl]
);

  // Effects
  // 1. Track Breakpoint Changes
  useEffect(() => {
    if (!isMobile) return;
    const newBreakpoint = getNearestBreakpoint(screenWidth || DEFAULT_SCREEN_WIDTH)
    if (newBreakpoint !== currentBreakpoint) {
      setCurrentBreakpoint(newBreakpoint)
    }
  }, [screenWidth, currentBreakpoint, isMobile])

  // 2. Initial Background URL Generation
  useEffect(() => {
  if (!isMobile || !mobileBackgroundImage) return;
  
  const imageUrl = generateBackgroundUrl(
    currentBreakpoint,
    getBestScreenHeight()
  );
  setOptimizedBackgroundUrl(imageUrl);
}, [isMobile, mobileBackgroundImage, currentBreakpoint, getBestScreenHeight, generateBackgroundUrl]);

  // 3. Clean up debounced function
  useEffect(() => {
    if (!screenWidth) return
    return () => {
      updateBackgroundUrl.cancel()
    }
  }, [screenWidth, updateBackgroundUrl])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        {/* Logo Section */}
        <Logo 
          logo={logo} 
          debug={false}
        />
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="block md:hidden"
            aria-label="Open navigation menu"
          >
            <Hamburger />
          </button>
        )}
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobile && mobileNavigation && (
        <MobileNavigation
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          backgroundImageUrl={optimizedBackgroundUrl}
          navigationItems={navigationItems}
          backgroundImage={mobileBackgroundImage}
          debugInfo={debugInfo}
          lqip={mobileBackgroundImage?.asset?.metadata?.lqip}
        />
      )}
    </nav>
  );
};
