'use client'

import { FC, useState, useEffect, useMemo } from 'react'
import Hamburger from '../elements/Hamburger'
import { Logo } from './Logo'
import { MobileNavigation } from './MobileNavigation'
import { useWindowSize } from '../hooks/useWindowSize'
import { useIsMobile } from '../hooks/useIsMobile'
import { DIMENSIONS } from '../constants'
import type { LogoType, NavLabelsType, SanityImageObject } from '../../types'
import { NavLink } from './common/NavLink'

interface NavigationProps {
  logo: LogoType
  navLabels: NavLabelsType
  mobileBackgroundImage?: SanityImageObject
}

export const Navigation: FC<NavigationProps> = ({ 
  logo, 
  navLabels, 
  mobileBackgroundImage 
}) => {
  // Core hooks
  const isMobile = useIsMobile()
  const { width: screenWidth } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Derived values
  const isDesktopScreen = useMemo(() => 
    screenWidth ? screenWidth >= DIMENSIONS.breakpoint.mobile : false,
  [screenWidth])

  // Navigation items
  const navigationItems = useMemo(() => [
    { label: navLabels.homePageNavLabel, href: '/' },
    { label: navLabels.projectsPageNavLabel, href: '/projects' },
    { label: navLabels.aboutPageNavLabel, href: '/about' },
    { label: navLabels.reviewsPageNavLabel, href: '/reviews' },
    { label: navLabels.contactPageNavLabel, href: '/contact' },
  ], [navLabels])

  // Close menu on desktop transition
  useEffect(() => {
    if (isDesktopScreen) {
      setIsMenuOpen(false)
    }
  }, [isDesktopScreen])

  return (
    <nav className='absolute top-0 left-0 w-full z-50'>
      {/* Desktop Navigation Bar */}
      <div className="flex items-center justify-between px-4 h-20">
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

        {/* Mobile Menu Toggle */}
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

      {/* Mobile Navigation */}
      {isMobile && !isDesktopScreen && mobileBackgroundImage && (
        <MobileNavigation
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navigationItems={navigationItems}
          backgroundImage={mobileBackgroundImage}
          lqip={mobileBackgroundImage?.asset?.metadata?.lqip ?? undefined}
          debugInfo={null}
        />
      )}
    </nav>
  )
}