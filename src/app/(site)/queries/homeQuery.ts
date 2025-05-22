import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_HOME = defineQuery(`*[_type == "siteSettingsSingleton"][0]{

  heroCTA,
  heroHeadline,
  heroImage {${IMAGE_WITH_METADATA}},

}`);