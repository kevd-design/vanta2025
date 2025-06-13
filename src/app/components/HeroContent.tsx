import { FC } from 'react'
import CTA from '@/app/components/common/Cta'
import type { HeroContentProps } from '@/app/lib/types/components/hero'

export const HeroContent: FC<Omit<HeroContentProps, 'headlineRef' | 'image' | 'elementColors'>> = ({
  headline,
  cta
}) => (
  <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
    <div className="w-full flex flex-col items-center md:pt-[40vh] space-y-8">
      {headline && (
        <h1 className="font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight text-black px-4">
          {headline}
        </h1>
      )}
      {cta && (
        <div className="mt-8">
          <CTA {...cta} />
        </div>
      )}
    </div>
  </div>
)