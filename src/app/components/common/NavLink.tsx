import Link from 'next/link'
import { forwardRef } from 'react'
import { useActivePage } from '@/app/hooks/useActivePage'
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

  if (variant === 'desktop') {
    return (
      <Link
        ref={ref}
        href={href}
        className={`
          relative text-base font-medium text-gray-700 
          hover:text-gray-900 transition-colors pb-2
          ${className}
        `}
        onClick={onClick}
      >
        {label}
        {active && (
          <span 
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
            aria-hidden="true"
          />
        )}
      </Link>
    )
  }

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