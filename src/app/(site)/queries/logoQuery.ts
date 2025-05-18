import { defineQuery } from "next-sanity"

export const QUERY_LOGO = defineQuery(`*[_type == "companySettingsSingleton"][0]{
  logoForLightBG {
    asset->{
      ...,
      metadata {
        dimensions,
        lqip
      },
      altText,
      title
    }
  },
  logoForDarkBG {
    asset->{
      ...,
      metadata {
        dimensions,
        lqip
      },
      altText,
      title
    }
  }
}`)