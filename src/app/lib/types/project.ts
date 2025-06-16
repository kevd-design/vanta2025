import type { ImageObject } from './image';
import type { SanitySlug } from './sanity';

export interface SanityProject {
  _id: string;
  projectName: string | null;
  projectSlug: SanitySlug | null;
  projectDescription?: string | null;
  projectImage: ImageObject | null;
}

export interface ProjectIndexMetadata {
  projectIndexPageTitle: string | null;
  projectIndexPageDescription: string | null;
}