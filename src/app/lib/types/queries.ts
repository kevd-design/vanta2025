import type { ImageObject } from './image';

export interface AboutPageQuery {
  siteSettings?: {
    aboutPageTitle?: string;
    aboutPageHeroImage?: ImageObject;
  };
  companySettings?: {
    slogan?: string;
    aboutHistory?: string;
    aboutMission?: string;
    aboutFounder?: string;
    founderImage?: ImageObject;
    aboutTeam?: string;
    teamImage?: ImageObject;
  };
}