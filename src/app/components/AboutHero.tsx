'use client'

import { FC } from 'react'
import { HeroBase } from '@/app/components/common/HeroBase'
import { HeroBackground } from '@/app/components/HeroBackground'
import type { ImageObject } from '@/app/lib/types/image'

interface AboutHeroProps {
  title: string
  heroImage: ImageObject | null
}

export const AboutHero: FC<AboutHeroProps> = ({
  title,
  heroImage
}) => {
  if (!heroImage?.asset) {
    return null
  }

  return (
    <HeroBase
      image={heroImage}
      height="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
    >
      {({ dimensions }) => (
        <>
          {/* Wrapper div with filter applied */}
          <div className="absolute inset-0 filter grayscale-[100%] saturate-50">
            {/* Background image */}
            <HeroBackground
              image={heroImage}
              dimensions={dimensions}
            />
          </div>

          {/* Emerald green overlay with opacity */}
          <div className="absolute inset-0 bg-emerald-800/80 z-10"></div>
          
          {/* Hero content */}
          <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center px-4">
            <div className="w-full flex flex-col items-center space-y-6 text-white">
              <h1 className="font-display font-normal text-4xl md:text-6xl text-center leading-tight">
                {title}
              </h1>
            </div>
          </div>
        </>
      )}
    </HeroBase>
  )
}