'use client'

import { FC, useState } from 'react'
import CTA from '@/app/components/common/Cta'
import { useImageHandler } from '@/app/hooks/useImageHandler'
import { IMAGE_OPTIONS } from '@/app/constants'
import type { ServicesProps } from '@/app/lib/types/components/common'

export const Services: FC<ServicesProps> = ({
  title,
  description,
  backgroundImage,
  cta,
}) => {
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null)
  
  // Use the imageHandler hook for background image processing
  const { imageUrl, isReady } = useImageHandler({
    image: backgroundImage,
    width: 1200,  // Use a reasonable size that works for this component
    height: 800,
    quality: IMAGE_OPTIONS.quality.high,
    objectFit: 'cover',
    onImageUrlGenerated: (url) => {
      if (url) setOptimizedImageUrl(url)
    }
  })

  return (
    <section className="bg-transparent py-0 md:py-16">
      <div className="container mx-auto">
        {/* Keep rounded corners across all devices */}
        <div className="relative overflow-hidden rounded-[32px]">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 overflow-hidden">
            {isReady && imageUrl && (
              <>
                {/* Mobile background - flipped horizontally */}
                <div 
                  className="absolute inset-0 md:hidden bg-cover bg-right"
                  style={{ 
                    backgroundImage: `url(${optimizedImageUrl || imageUrl})`,
                    transform: 'scaleX(-1)'
                  }}
                >
                  {/* Mobile gradient - counter-flipped to display correctly */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"
                    style={{ transform: 'scaleX(-1)' }}
                  ></div>
                </div>
                
                {/* Desktop background - not flipped */}
                <div 
                  className="absolute inset-0 hidden md:block bg-cover bg-left"
                  style={{ 
                    backgroundImage: `url(${optimizedImageUrl || imageUrl})`
                    // No transform applied here
                  }}
                >
                  {/* Desktop gradient */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-l from-black via-black/50 to-transparent"
                  ></div>
                </div>
              </>
            )}
          </div>

          {/* Content container */}
          <div className="relative z-10 py-28 md:py-24 px-5 md:px-8">
            <div className="flex flex-col md:flex-row md:gap-24 items-start justify-between">
              {/* Text content - limited to 3/4 width on mobile, full-width md:w-1/2 on larger screens */}
              <div className="w-3/4 md:w-1/2 md:ml-auto md:order-2 text-white text-left">
                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  {title}
                </h2>
                <div className="mb-6 text-lg">
                  <p>{description}</p>
                </div>
                
                {/* CTA - Full width on mobile, aligned with text on desktop */}
                {cta && (
                  <div className="w-full md:w-auto mt-6">
                    <CTA 
                      {...cta} 
                      className="w-full md:w-auto flex justify-between items-center rounded-xl transition-colors text-white"
                    />
                  </div>
                )}
              </div>
              
              {/* This empty div ensures proper spacing on desktop */}
              <div className="hidden md:block md:w-1/3 md:order-1"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}