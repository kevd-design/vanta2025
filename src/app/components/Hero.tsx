'use client'

import { FC, useState } from 'react'
import Image from 'next/image'
import { HeroBackground } from '@/app/components/HeroBackground'
import { HeroContent } from '@/app/components/HeroContent'
import { ImageContainer } from '@/app/components/common/ImageContainer'
import type { HeroSection } from '@/app/lib/types/components/hero'

export const Hero: FC<HeroSection> = ({
  image,
  headline,
  cta
}) => {
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null)

  if (!image?.asset) {
    return null;
  }

  return (
    <>
      <ImageContainer 
        className="relative w-full h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px] rounded-b-[32px] overflow-hidden"
        setOptimizedImageUrl={setOptimizedImageUrl}
      >
        {({ dimensions, setOptimizedImageUrl: containerSetOptimizedImageUrl }) => (
          <>
            <HeroBackground 
              image={image}
              dimensions={dimensions}
              setOptimizedImageUrl={(url: string) => {
                containerSetOptimizedImageUrl(url);
                setOptimizedImageUrl(url);
              }}
            />
            
            {/* Use simplified HeroContent component */}
            <HeroContent
              headline={headline}
              cta={cta}
            />
          </>
        )}
      </ImageContainer>
      
      {/* No-JS fallback content */}
      <noscript>
        <div className="relative w-full h-[90vh] sm:h-[800px] md:h-[1200px] lg:h-[1582px] xl:h-[1800px] 2xl:h-[2000px] rounded-b-[32px] overflow-hidden">
          {image?.asset?.url && (
            <Image
              src={optimizedImageUrl || image.asset.url}
              alt={image.alt || ''}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="relative z-10 container mx-auto px-4 pt-32">
            {headline && (
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-8">
                {headline}
              </h1>
            )}
            {cta && (
              <div className="inline-block bg-black text-white px-6 py-3 rounded-lg">
                {cta.linkLabel}
              </div>
            )}
          </div>
        </div>
      </noscript>
    </>
  )
}