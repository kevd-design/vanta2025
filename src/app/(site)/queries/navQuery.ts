import { defineQuery } from "next-sanity"

export const QUERY_NAV = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  homePageNavLabel,
  projectsPageNavLabel,
  aboutPageNavLabel,
  reviewsPageNavLabel,
  contactPageNavLabel,
  mobileBackgroundImage {
    ...,
    asset->{
      ...,
      metadata
    }
  }
}`);