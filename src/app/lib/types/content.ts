
import type { ImageObject } from './image';

// CTA belongs here - it's related to content structure, not Sanity implementation
export interface CTAType {
  linkLabel: string;
  linkType: "toPage" | "externalLink" | "toProject";
  toProject?: string;
  toPage?: "about" | "contact" | "home" | "projects" | "reviews";
  externalLink?: string;
}

// Other content-related types
export interface ProjectType {
  title: string;
  slug: string;
  mainImage: ImageObject;
  description: string;
}

export interface ReviewType {
  reviewerName: string;
  reviewText: string;
  cta: CTAType;
}