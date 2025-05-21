import { defineQuery } from "next-sanity"

export const QUERY_HOME = defineQuery(`*[_type == "siteSettingsSingleton"][0]{

  heroCTA,
  heroHeadline,
  heroImage {
    ...,
    asset->{
      ...,
      metadata
    }
  },

}`);