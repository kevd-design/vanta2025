import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

// Define the response structure
interface SiteSettingsMetadata {
  title: string | null
  description: string | null
  siteImage?: {
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

// Define the query as a raw string
export const QUERY_METADATA = `*[_type == "siteSettingsSingleton"][0]{
  "title": Sitetitle,
  description,
  siteImage {
    ${IMAGE_WITH_METADATA},
    "altText": alt
  }
}` as const;

// Export the type for the query result
export type MetadataQueryResult = SiteSettingsMetadata