'use client'

import { FC } from 'react'
import Cta from '@/app/components/common/Cta'
import { OptimizedImage } from '@/app/components/common/OptimizedImage'
import { PageBackground } from '@/app/components/common/PageBackground'
import { ReviewsPageBackground } from '@/app/components/ReviewsPageBackground'
import type { ImageObject } from '@/app/lib/types/image'
import type { CTAType } from '@/app/lib/types/content'

interface ReviewsPageProps {
  reviewPageTitle?: string;
  reviewPageBackgroundImage?: ImageObject | null;
  reviewPageDescriptiveImage?: ImageObject | null;
  reviewPageSummary?: string | null;
  viewReviewsCTA?: CTAType | null;
  submitReviewTitle?: string;
  submitReviewInvitation?: string | null;
  submitReviewCTA?: CTAType | null;
}

export const ReviewsPage: FC<ReviewsPageProps> = ({
  reviewPageTitle = "Reviews",
  reviewPageBackgroundImage,
  reviewPageDescriptiveImage,
  reviewPageSummary,
  viewReviewsCTA,
  submitReviewTitle = "Submit a review",
  submitReviewInvitation,
  submitReviewCTA
}) => {
  // Get LQIP for background image
  const backgroundLqip = reviewPageBackgroundImage?.asset?.metadata?.lqip ?? undefined;
  
  return (
    <PageBackground
      backgroundImage={reviewPageBackgroundImage}
      backgroundComponent={ReviewsPageBackground}
      lqip={backgroundLqip}
    >
      {/* Content */}
      <div className="py-48 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          {/* Desktop: Two-column layout */}
          <div className="hidden md:flex items-center justify-center">
            {/* Content Column - LEFT side on desktop */}
            <div className="w-1/2 pr-8">
              <h1 className="font-display text-4xl lg:text-5xl text-gray-900 mb-6">
                {reviewPageTitle}
              </h1>
              
              {reviewPageSummary && (
                <p className="text-lg text-gray-700 mb-8">
                  {reviewPageSummary}
                </p>
              )}
              
              {/* View Reviews Button */}
              {viewReviewsCTA && (
                <div className="mb-12">
                  <Cta {...viewReviewsCTA} />
                </div>
              )}
              
              {/* Submit Review Section */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-6">
                  {submitReviewTitle}
                </h2>
                
                {submitReviewInvitation && (
                  <p className="text-lg text-gray-700 mb-8">
                    {submitReviewInvitation}
                  </p>
                )}
                
                {/* Submit Review Button */}
                {submitReviewCTA && (
                  <div className="mt-6">
                    <Cta {...submitReviewCTA} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Image Column - RIGHT side on desktop */}
            <div className="w-1/2 max-w-md">
              {reviewPageDescriptiveImage && (
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <OptimizedImage
                    image={reviewPageDescriptiveImage}
                    width={600}
                    height={400}
                    quality={85}
                    className="w-full"
                    priority={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Stacked layout with text taking 3/4 width */}
          <div className="md:hidden">
            <div className="w-3/4 pr-4"> {/* Mobile: Text spans 3/4 from left */}
              <h1 className="font-display text-3xl text-gray-900 mb-6">
                {reviewPageTitle}
              </h1>
              
              {reviewPageSummary && (
                <p className="text-base text-gray-700 mb-8">
                  {reviewPageSummary}
                </p>
              )}
              
              {/* Reviews Preview Image on Mobile - Below title */}
              {reviewPageDescriptiveImage && (
                <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                  <OptimizedImage
                    image={reviewPageDescriptiveImage}
                    width={600}
                    height={400}
                    quality={85}
                    className="w-full"
                  />
                </div>
              )}
              
              {/* View Reviews Button */}
              {viewReviewsCTA && (
                <div className="mb-10">
                  <Cta {...viewReviewsCTA} />
                </div>
              )}
              
              {/* Submit Review Section */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="font-display text-xl text-gray-900 mb-4">
                  {submitReviewTitle}
                </h2>
                
                {submitReviewInvitation && (
                  <p className="text-base text-gray-700 mb-6">
                    {submitReviewInvitation}
                  </p>
                )}
                
                {/* Submit Review Button */}
                {submitReviewCTA && (
                  <div className="mt-4">
                    <Cta {...submitReviewCTA} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}