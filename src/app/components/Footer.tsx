'use client'

import { FC } from 'react'

interface FooterProps {
  displayCopyright: boolean
  textBeforeCopyright?: string | null
  copyrightText?: string | null
  copyrightYear: boolean
  textAfterCopyright?: string | null
}

export const Footer: FC<FooterProps> = ({
  displayCopyright,
  textBeforeCopyright,
  copyrightText,
  copyrightYear,
  textAfterCopyright
}) => {
  // Only render footer if copyright should be displayed
  if (!displayCopyright) return null
  
  // Generate current year for copyright if needed
  const year = copyrightYear ? new Date().getFullYear() : null
  
  return (
    <footer className="bg-emerald-800 text-white mt-auto rounded-t-[32px]">
      <div className="container mx-auto py-6 px-4 text-center">
        <p className="text-sm md:text-base">
          {textBeforeCopyright && <span>{textBeforeCopyright}{' '}</span>}
          {copyrightText && <span>{copyrightText}{' '}</span>}
          {year && <span>{year}{' '}</span>}
          {textAfterCopyright && <span>{textAfterCopyright}</span>}
        </p>
      </div>
    </footer>
  )
}