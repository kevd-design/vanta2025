'use client'

import { FC, useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Hamburger from '../elements/Hamburger'
import { Logo } from './Logo'
import { urlFor } from '@/sanity/lib/image'
import { MobileNavigation } from './MobileNavigation'
import { useWindowSize } from '../hooks/useWindowSize'
import { debounce } from 'lodash'

interface NavigationProps {
  logo: {
    logoForLightBG: {
      asset: {
        altText?: string
        title?: string
        metadata: {
          lqip: string
          dimensions: {
            width: number
            height: number
          }
        }
      }
    }
  }
  navLabels: {
    homePageNavLabel: string
    projectsPageNavLabel: string
    aboutPageNavLabel: string
    reviewsPageNavLabel: string
    contactPageNavLabel: string
  }
   mobileBackgroundImage: {
    asset: {
      metadata: {
        lqip: string
        dimensions: {
          aspectRatio: number
          width: number
          height: number
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
}



export const Navigation: FC<NavigationProps> = ({ logo, navLabels, mobileBackgroundImage }) => {
  const { width: screenWidth } = useWindowSize()
  const { height: screenHeight } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [optimizedBackgroundUrl, setOptimizedBackgroundUrl] = useState('')
  const [lastBreakpoint, setLastBreakpoint] = useState<number | null>(null);

  



  const navigationItems = [
    { label: navLabels.homePageNavLabel, href: '/' },
    { label: navLabels.projectsPageNavLabel, href: '/projects' },
    { label: navLabels.aboutPageNavLabel, href: '/about' },
    { label: navLabels.reviewsPageNavLabel, href: '/reviews' },
    { label: navLabels.contactPageNavLabel, href: '/contact' },
  ]

const getBestScreenWidth = useCallback(() => {

  return screenWidth || 390 // fallback
}, [screenWidth])

const getBestScreenHeight = useCallback(() => {

  return screenHeight || 844 // fallback

}, [screenHeight])

const getBestDpr = useCallback(() => {
  if (typeof window !== 'undefined') {
    const availWidth = window.screen.availWidth
    if (availWidth > 1920) return 3
    if (availWidth > 1024) return 2
    return 1
  }
  return 1 // fallback for SSR
}, [])




    // Debounced URL update for background
const updateBackgroundUrl = useMemo(
  () =>
    debounce(() => {
      if (!screenWidth) return
      
      const rawWidth = getBestScreenWidth();
      const bestWidth = getNearestBreakpoint(rawWidth);
      if (lastBreakpoint === bestWidth) return; // Only update if breakpoint changed
      setLastBreakpoint(bestWidth);

      const bestHeight = getBestScreenHeight()
      const dpr = getBestDpr()
      const flippedX = mobileBackgroundImage?.hotspot
      ? 1 - mobileBackgroundImage.hotspot.x
      : 0.5;
    const focalY = mobileBackgroundImage?.hotspot?.y ?? 0.5;
    
    const BREAKPOINTS = [320, 375, 425, 640, 768, 1024, 1280, 1536, 1920];
    function getNearestBreakpoint(width: number) {
      return BREAKPOINTS.reduce((prev, curr) =>
        Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
      );
    }

      const imageUrl = urlFor(mobileBackgroundImage)
        .width(Math.round(bestWidth))
        .height(Math.round(bestHeight))
        .flipHorizontal()
        .fit('crop')
        .focalPoint(flippedX, focalY)
        .dpr(dpr)
        .quality(90)
        .auto('format')
        .url()
      setOptimizedBackgroundUrl(imageUrl)
    }, 1000),
  [
    mobileBackgroundImage,
    getBestScreenWidth,
    getBestScreenHeight,
    getBestDpr,
    screenWidth,
    setOptimizedBackgroundUrl,
    lastBreakpoint,
  ]
)

const debugInfo = {
  url: optimizedBackgroundUrl,
  width: getBestScreenWidth(),
  dpr: getBestDpr(),
};

    // Update background URL when screen width changes
  useEffect(() => {
    if (!screenWidth) return
    

    return () => {
      updateBackgroundUrl.cancel()
    }
  }, [screenWidth, updateBackgroundUrl])

    // Initial background URL generation
  useEffect(() => {
    if (!screenWidth || !mobileBackgroundImage) return
    
    const bestWidth = getBestScreenWidth()
    const bestHeight = getBestScreenHeight()
    const dpr = getBestDpr()
    const flippedX = mobileBackgroundImage?.hotspot
      ? 1 - mobileBackgroundImage.hotspot.x
      : 0.5;
    const focalY = mobileBackgroundImage?.hotspot?.y ?? 0.5;

    const initialImageUrl = urlFor(mobileBackgroundImage)
      .width(Math.round(bestWidth))
      .height(Math.round(bestHeight))
      .flipHorizontal()
      .fit('crop')
      .focalPoint(flippedX, focalY)
      
      .dpr(dpr)
      .quality(90)
      .auto('format')
      .url()
    setOptimizedBackgroundUrl(initialImageUrl)
  }, [
    mobileBackgroundImage, 
    getBestScreenWidth, 
    getBestScreenHeight, 
    getBestDpr, 
    screenWidth,
    updateBackgroundUrl
  ])

    


  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Main navigation bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <Logo logo={logo} />
        
        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="block md:hidden"
          aria-label="Open menu"
        >
          <Hamburger />
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        backgroundImageUrl={optimizedBackgroundUrl}
        navigationItems={navigationItems}
        backgroundImage={mobileBackgroundImage}
        debugInfo={debugInfo}
      />
    </nav>
  )
}
