import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"
import type { SiteSettingsMetadata } from '@/app/lib/types/site'

export const QUERY_METADATA = `*[_type == "siteSettingsSingleton"][0]{
  Sitetitle,
  description,
  heroImage {  // Changed from siteImage to heroImage
    ${IMAGE_WITH_METADATA},
    "altText": alt
  }
}` as const;

export type MetadataQueryResult = SiteSettingsMetadata