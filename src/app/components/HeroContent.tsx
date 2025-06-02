import { FC } from 'react'
import CTA from '@/app/components/common/Cta'
import { HeroContentProps } from '@/app/lib/types/components/hero'

export const HeroContent: FC<HeroContentProps> = ({
  headline,
  cta,
  headlineRef,
  ctaRef,
  getTextColorClass
}) => (
  <div className="relative z-15 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
    <div className="w-full flex flex-col items-center md:pt-[40vh] space-y-8">
      {headline && (
        <h1 
          ref={headlineRef}
          className={`font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight px-12 ${getTextColorClass('Headline')}`}
        >
          {headline}
        </h1>
      )}
      {cta && (
        <div 
          ref={ctaRef} 
          className={getTextColorClass('CTA')}
        >
          <CTA {...cta} />
        </div>
      )}
    </div>
  </div>
)