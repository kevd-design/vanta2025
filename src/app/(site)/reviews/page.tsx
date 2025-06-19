import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { QUERY_REVIEWS_PAGE } from '@/app/queries/reviewsQuery'
import { ReviewsPage } from '@/app/components/ReviewsPage'
import type { ImageObject } from '@/app/lib/types/image'
import type { CTAType } from '@/app/lib/types/content'

export const metadata: Metadata = {
  title: 'Reviews | Vanta Construction',
  description: 'Read reviews from our satisfied clients and submit your own review of Vanta Construction.',
}

// Define the type for the query result
interface ReviewsPageData {
  reviewPageTitle?: string;
  reviewPageBackgroundImage?: ImageObject;
  reviewPageDescriptiveImage?: ImageObject;
  reviewPageSummary?: string;
  viewReviewsCTA?: CTAType;
  submitReviewTitle?: string;
  submitReviewInvitation?: string;
  submitReviewCTA?: CTAType;
}

export default async function Reviews() {
  // Fetch reviews page data with proper typing
  const data = await client.fetch<ReviewsPageData>(QUERY_REVIEWS_PAGE);
  
  return (
    <div className="relative min-h-screen">
      {/* Content Component - the background will be handled in the client component */}
      <ReviewsPage
        reviewPageTitle={data?.reviewPageTitle || "Reviews"}
        reviewPageBackgroundImage={data?.reviewPageBackgroundImage || null}
        reviewPageDescriptiveImage={data?.reviewPageDescriptiveImage || null}
        reviewPageSummary={data?.reviewPageSummary || null}
        viewReviewsCTA={data?.viewReviewsCTA || null}
        submitReviewTitle={data?.submitReviewTitle || "Submit a review"}
        submitReviewInvitation={data?.submitReviewInvitation || null}
        submitReviewCTA={data?.submitReviewCTA || null}
      />
    </div>
  )
}