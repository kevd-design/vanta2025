'use client'

import Link from 'next/link'
import { forwardRef } from 'react'
import { useActivePage } from '@/app/hooks/useActivePage'
import { usePathname } from 'next/navigation'
import type { NavLinkProps } from '@/app/lib/types/components/navigation'

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({
  href,
  label,
  variant,
  onClick,
  className = ''
}, ref) => {
  const { isActivePage } = useActivePage()
  const active = isActivePage(href)
  const pathname = usePathname()
  
  // Check if we're on a project detail page
  const isProjectDetailPage = pathname.startsWith('/projects/') && pathname !== '/projects'
  
  // Determine text and underline color based on current page
  const getTextColors = () => {
    if (pathname === '/') {
      // Home page - white text
      return 'text-black hover:text-black'
    } else if (isProjectDetailPage) {
    // Projects page - white text
    return 'text-white hover:text-white'
    } else if (pathname === '/projects') {
      // Projects page - white text
      return 'text-white hover:text-white'
    } else if (pathname === '/about') {
      // About page - emerald text
      return 'text-emerald-800 hover:text-emerald-900'
    } else {
      // Default - white text
      return 'text-white hover:text-white'
    }
  }

  if (variant === 'desktop') {
    const textColors = getTextColors()
    
    return (
      <Link
        ref={ref}
        href={href}
        className={`
          relative text-base font-medium 
          ${textColors} transition-colors pb-2
          ${className}
        `}
        onClick={onClick}
      >
        {label}
        {active && (
          <span 
            className={`absolute bottom-0 left-0 w-full h-1 rounded-full ${
              pathname === '/' ? 'bg-emerald-800' :  'bg-white'
            }`}
            aria-hidden="true"
          />
        )}
      </Link>
    )
  }

  // Mobile variant styling unchanged
  return (
    <Link
      ref={ref}
      href={href}
      className={`
        col-span-3 justify-self-start w-full
        rounded-lg text-center py-4 px-6 
        text-lg font-medium shadow transition-colors 
        focus:outline-none focus:ring-4 focus:ring-emerald-400
        ${active
          ? 'bg-amber-100 pointer-events-none'
          : 'bg-emerald-100 hover:bg-amber-200'
        }
        ${className}
      `}
      tabIndex={active ? -1 : 0}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
    </Link>
  )
})

NavLink.displayName = 'NavLink'