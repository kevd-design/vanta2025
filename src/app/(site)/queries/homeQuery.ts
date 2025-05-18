import { defineQuery } from "next-sanity"

export const QUERY_HOME = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  "hero": {
  "headline": heroHeadline,
  "image": heroImage {
    asset->{
      ...,
      metadata
    },
    hotspot,
    alt
  },
  "cta": heroCTA
},
  "projects": {
    "cta": projectCTA {
      ...
    }
  },
  "services": {
    "title": servicesTitle,
    "description": servicesDescription,
    "backgroundImage": backgroundImageServices {
      asset->,
      hotspot,
      "metadata": asset->metadata
    },
    "cta": servicesCTA
  },
  "review": {
    "reviewerName": reviewerName,
    "reviewText": reviewText,
    "cta": reviewCTA
  },
  "meta": {
    "title": siteTitle,
    "description": description
  }
}`);