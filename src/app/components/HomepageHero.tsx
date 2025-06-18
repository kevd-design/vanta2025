'use client'

import { FC } from 'react'
import { HeroContent } from '@/app/components/HeroContent'
import { HeroBase } from '@/app/components/common/HeroBase'
import type { HeroSection } from '@/app/lib/types/components/hero'

export const HomepageHero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  if (!image?.asset) {
    return null;
  }

  return (
    <>
      <HeroBase
        image={image}
        height="h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px]"
      >
        {() => (
          <HeroContent
            headline={headline}
            cta={cta}
          />
        )}
      </HeroBase>
    </>
  )
}