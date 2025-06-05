import { FC } from 'react'
import CTA from '@/app/components/common/Cta'
import { AdaptiveText } from '@/app/components/common/AdaptiveText'
import { HeroContentProps } from '@/app/lib/types/components/hero'

export const HeroContent: FC<HeroContentProps> = ({
  headline,
  cta,
  headlineRef,
  image,
  elementColors
}) => (
  <div className="relative z-15 container mx-auto h-full flex flex-col items-center justify-center md:justify-start">
    <div ref={headlineRef} className="w-full flex flex-col items-center md:pt-[40vh]">
      {(headline || cta) && (
        <AdaptiveText
          className="flex flex-col items-center md:rounded-lg"
          image={image}
          preferences={['dominant']}
          minContrast={4.5}
          backgroundOpacity={"auto"}
          padding="px-8 py-6 md:px-12 md:py-12" 
          accessibilityData={{
            needsBackground: elementColors?.['HeroContent']?.needsBackground,
            wcagCompliant: elementColors?.['HeroContent']?.wcagCompliant
          }}
          showDebug={false}
        >
          {headline && (
            <h1 className="font-display font-normal text-5xl md:text-[96px] max-w-3xl text-center leading-tight">
              {headline}
            </h1>
          )}
          {cta && (
            <div className="mt-8">
              <CTA {...cta} />
            </div>
          )}
        </AdaptiveText>
      )}
    </div>
  </div>
)