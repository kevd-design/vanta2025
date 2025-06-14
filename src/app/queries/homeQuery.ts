import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_HOME = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  // Hero section
  heroCTA,
  heroHeadline,
  heroImage {${IMAGE_WITH_METADATA}},
  
  // Project section
  projectCTA {
    ...,
    "project": toProject-> {
      _id,
      projectName,
      projectSlug,
      projectImage {${IMAGE_WITH_METADATA}}
    }
  },
  
  // Services section
  servicesTitle,
  servicesDescription,
  backgroundImageServices {${IMAGE_WITH_METADATA}},
  servicesCTA
}`);