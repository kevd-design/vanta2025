import type { CTAType } from './content';
import type { ImageObject } from './image';

// Hero Section
export interface HeroSection {
  headline: string | null;
  image: ImageObject | null;
  cta: CTAType | null;
}

// Projects Section
export interface ProjectsSection {
  cta: CTAType;
}

// Services Section
export interface ServicesSection {
  title: string;
  description: string;
  backgroundImage: ImageObject;
  cta: CTAType;
}

// Home page data structure
export interface HomeData {
  hero: HeroSection;
  projects: ProjectsSection;
  services: ServicesSection;
//   review: ReviewType;
//   meta: MetaSection;
}