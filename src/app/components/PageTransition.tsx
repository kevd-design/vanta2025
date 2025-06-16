'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  
  // Scroll to top immediately on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Simple fade-in animation without exit animations
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex-grow"
    >
      {children}
    </motion.div>
  )
}