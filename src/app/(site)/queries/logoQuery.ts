import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_LOGO = defineQuery(`*[_type == "companySettingsSingleton"][0]{
  logoForLightBG {${IMAGE_WITH_METADATA}},
  logoForDarkBG {${IMAGE_WITH_METADATA}}
}`)