import type { ImageObject } from './image';

/**
 * Site-wide settings and metadata
 */
export interface SiteSettingsMetadata {
  Sitetitle: string | null;
  description: string | null;
  heroImage?: ImageObject;
}

