'use client'

import { FC } from 'react'
import { QuoteIcon } from '@/app/elements/QuoteIcon'
import { StarIcon } from '@/app/elements/StarIcon'
import CTA from '@/app/components/common/Cta'
import type { ReviewProps } from '@/app/lib/types/components/common'

export const Review: FC<ReviewProps> = ({
  reviewerName,
  reviewText,
  cta
}) => {
  // Generate 5 stars for the review
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-2">
        {[...Array(5)].map((_, index) => (
          <StarIcon key={index} />
        ))}
      </div>
    )
  }

  return (
    <section className="bg-cream-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Main review content */}
        <div className="md:max-w-4xl md:mx-auto">
          {/* Quote and content container */}
          <div className="flex flex-col md:flex-row md:items-center">
            {/* Quote icon - reduced size slightly */}
            <div className="flex-shrink-0 md:mr-16 mb-6 md:mb-0">
              <div className="w-9 md:w-[110px] text-emerald-800">
                <QuoteIcon className="w-full h-auto" />
              </div>
            </div>
            
            {/* Name, stars, and review text only */}
            <div className="flex-grow">
              {/* Name and Stars */}
              <h3 className="text-xl font-display mb-4">{reviewerName}</h3>
              
              <div className="mb-6">
                {renderStars()}
              </div>
              
              {/* Review text */}
              <p className="italic text-lg md:text-2xl font-light text-gray-900">
                {reviewText}
              </p>
            </div>
          </div>
          
          {/* CTA - separate from the content alignment, full width on mobile, right-aligned on desktop */}
          {cta && (
            <div className="mt-8 md:text-right">
              <CTA 
                {...cta} 
                className="w-full md:w-auto inline-flex justify-between items-center rounded-xl transition-colors text-emerald-800"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}