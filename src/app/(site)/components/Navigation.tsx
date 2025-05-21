'use client'

import { FC, useState, useEffect, useMemo, useCallback } from 'react'
import Hamburger from '../elements/Hamburger'
import { Logo } from './Logo'
import { MobileNavigation } from './MobileNavigation'
import { useWindowSize } from '../hooks/useWindowSize'
import { debounce } from 'lodash'
import { useBestDpr } from '../hooks/useBestDpr'
import { useIsMobile } from '../hooks/useIsMobile'
import { useUrlCache } from '../hooks/useUrlCache'
import { DIMENSIONS, getNearestBreakpoint, IMAGE_OPTIONS } from '../constants'
import type { LogoType, NavLabelsType, imageType } from '../../types'
import { NavLink } from './common/NavLink'

const { 
  defaultWidth: DEFAULT_SCREEN_WIDTH, 
  defaultHeight: DEFAULT_SCREEN_HEIGHT 
} = DIMENSIONS.screen

interface NavigationProps {
  logo: LogoType
  navLabels: NavLabelsType
  mobileBackgroundImage?: imageType
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
  const [optimizedBackgroundUrl, setOptimizedBackgroundUrl] = useState<string | null>(null)
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

    
  // Screen Size Memoization
  const getBestScreenWidth = useMemo(() => 
    () => Math.round(screenWidth || DEFAULT_SCREEN_WIDTH), 
  [screenWidth])
  
  const getBestScreenHeight = useMemo(() => 
    () => Math.round(screenHeight || DEFAULT_SCREEN_HEIGHT), 
  [screenHeight])

const isDesktopScreen = useMemo(() => 
  screenWidth ? screenWidth >= DIMENSIONS.breakpoint.mobile : false,
[screenWidth])

const generateBackgroundUrl = useCallback((width: number, height: number) => {
    if (!isMobile || !mobileBackgroundImage?.asset) return null;
  
    
  
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
    if (!isMobile || !mobileBackgroundImage?.asset) return null;
    
    return {
      backgroundUrl: optimizedBackgroundUrl || null,
      updateUrl: generateBackgroundUrl,
      // ... other mobile-specific logic
    }
  }, [isMobile, mobileBackgroundImage, optimizedBackgroundUrl, generateBackgroundUrl])


  // Debug Information
  const debugInfo = useMemo(() => {
  if (!optimizedBackgroundUrl) return null;
  
  return {
    url: optimizedBackgroundUrl,
    width: getBestScreenWidth(),
    dpr: dpr,
  }
}, [optimizedBackgroundUrl, getBestScreenWidth, dpr])

  

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

  if (imageUrl) {
    setOptimizedBackgroundUrl(imageUrl);
  }
}, [isMobile, mobileBackgroundImage, currentBreakpoint, getBestScreenHeight, generateBackgroundUrl]);

  

  // Effect to handle desktop transition
useEffect(() => {
  const handleResize = debounce(() => {
    const newIsDesktop = (screenWidth || 0) >= DIMENSIONS.breakpoint.mobile;
    
    if (newIsDesktop) {
      setIsMenuOpen(false);  // Close menu when going to desktop
      setOptimizedBackgroundUrl(null);  // Clear background URL
    } else if (isMobile && mobileBackgroundImage) {
      // Only generate new URL if actually needed
      const bestWidth = getNearestBreakpoint(getBestScreenWidth());
      if (bestWidth !== lastBreakpoint) {
        const imageUrl = generateBackgroundUrl(bestWidth, getBestScreenHeight());
        if (imageUrl) {
          setLastBreakpoint(bestWidth);
          setOptimizedBackgroundUrl(imageUrl);
        }
      }
    }
  }, 150); // Add small debounce to prevent rapid changes

  // Initial check
  handleResize();

  // Add listener
  window.addEventListener('resize', handleResize);
  
  // Cleanup
  return () => {
    handleResize.cancel();
    window.removeEventListener('resize', handleResize);
  };
}, [
  screenWidth,
  isMobile,
  mobileBackgroundImage,
  generateBackgroundUrl,
  getBestScreenWidth,
  getBestScreenHeight,
  lastBreakpoint
]);

// Cleanup effects
useEffect(() => {
  return () => {
    // Cleanup on unmount
    setOptimizedBackgroundUrl(null)
    setIsMenuOpen(false)
    setLastBreakpoint(null)
    
  }
}, [])

  return (
    <nav>
      {/* Desktop Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white ">
        {/* Logo Section */}
        <Logo 
          logo={logo} 
          debug={false}
        />
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-end justify-between flex-1 px-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              variant="desktop"
            />
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        {isMobile && !isDesktopScreen && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="block md:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Hamburger />
          </button>
        )}
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobile && !isDesktopScreen && mobileNavigation?.backgroundUrl &&  (
        <MobileNavigation
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navigationItems={navigationItems}
          backgroundImage={mobileBackgroundImage || null}
          debugInfo={debugInfo || undefined}
          lqip={mobileBackgroundImage?.asset?.metadata?.lqip}
        />
      )}
    </nav>
  );
};
