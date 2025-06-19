import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_REVIEWS_PAGE = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  reviewPageTitle,
  reviewPageBackgroundImage {${IMAGE_WITH_METADATA}},
  reviewPageDescriptiveImage {${IMAGE_WITH_METADATA}},
  reviewPageSummary,
  viewReviewsCTA {
    ...,
  },
  submitReviewTitle,
  submitReviewInvitation,
  submitReviewCTA {
    ...,
  }
}`)