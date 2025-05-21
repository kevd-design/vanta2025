import { defineQuery } from "next-sanity"

export const QUERY_LOGO = defineQuery(`*[_type == "companySettingsSingleton"][0]{
  logoForLightBG {
    ...,
    asset->{
      ...,
      metadata
    }
  },
  logoForDarkBG {
    ...,
    asset->{
      ...,
      metadata
    }
  }
}`)