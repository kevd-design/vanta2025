'use client'

import { FC, useState, useEffect, useMemo } from 'react'
import { Logo } from '@/app/components/Logo'
import { DIMENSIONS } from '@/app/constants'
import Hamburger from '@/app/elements/Hamburger'
import { useIsMobile } from '@/app/hooks/useIsMobile'
import { useWindowSize } from '@/app/hooks/useWindowSize'
import { NavLink } from '@/app/components/common/NavLink'
import { MobileNavigation } from '@/app/components/MobileNavigation'
import { usePathname } from 'next/navigation'
import type { NavigationProps } from '@/app/lib/types/components/navigation'

export const Navigation: FC<NavigationProps> = ({ 
  logo, 
  navLabels, 
  mobileBackgroundImage,
}) => {
  // Core hooks
  const isMobile = useIsMobile()
  const { width: screenWidth } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Determine background style and logo variant based on path
  const getNavStyle = () => {
    if (pathname === '/') {
      return { 
        bgClass: 'bg-transparent', 
        logoVariant: 'dark' as const, // Black logo on homepage
        hamburgerColor: 'dark' as const, // Black hamburger on homepage (for contrast with background)
        hasRadius: false  // No border radius on transparent nav
      }
    } else if (pathname === '/projects') {
      return { 
        bgClass: 'bg-emerald-800', 
        logoVariant: 'light' as const,
        hamburgerColor: 'light' as const,
        hasRadius: true  // Add border radius
      }
    } else if (pathname === '/about') {
      return { 
        bgClass: 'bg-white', 
        logoVariant: 'dark' as const,
        hamburgerColor: 'dark' as const,
        hasRadius: true  // Add border radius
      }
    } else {
      return { 
        bgClass: 'bg-emerald-800', 
        logoVariant: 'light' as const,
        hamburgerColor: 'light' as const,
        hasRadius: true  // Add border radius
      }
    }
  }

  // Removed extraHeight from the return value
  const { bgClass, logoVariant, hamburgerColor, hasRadius } = getNavStyle()

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
    <nav className={`absolute top-0 left-0 w-full z-50 ${bgClass} ${hasRadius ? 'rounded-b-[32px]' : ''}`}>
      {/* Desktop Navigation Bar with consistent height across all pages */}
      <div className="flex items-center justify-between px-4 h-24 md:h-28">
        <Logo 
          logo={logo} 
          debug={false}
          variant={logoVariant}
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
            <Hamburger color={hamburgerColor} />
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
        />
      )}
    </nav>
  )
}