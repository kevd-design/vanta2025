import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

interface SiteSettingsMetadata {
  Sitetitle: string | null
  description: string | null
  heroImage?: {  // Changed from siteImage to heroImage
    asset?: {
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
        }
      }
    }
    altText?: string
  }
}

export const QUERY_METADATA = `*[_type == "siteSettingsSingleton"][0]{
  Sitetitle,
  description,
  heroImage {  // Changed from siteImage to heroImage
    ${IMAGE_WITH_METADATA},
    "altText": alt
  }
}` as const;

export type MetadataQueryResult = SiteSettingsMetadata