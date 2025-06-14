import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_NAV = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  homePageNavLabel,
  projectsPageNavLabel,
  aboutPageNavLabel,
  reviewsPageNavLabel,
  contactPageNavLabel,
  mobileBackgroundImage {${IMAGE_WITH_METADATA}},
  
  // Footer data
  displayCopyright,
  textBeforeCopyright,
  copyrightText,
  copyrightYear,
  textAfterCopyright
}`);