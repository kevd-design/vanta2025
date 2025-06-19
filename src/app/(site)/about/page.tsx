import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { QUERY_ABOUT_PAGE } from '@/app/queries/aboutQuery'
import { AboutHero } from '@/app/components/AboutHero'
import { AboutContent } from '@/app/components/AboutContent'
import { AboutTeam } from '@/app/components/AboutTeam'
import type { ImageObject } from '@/app/lib/types/image'

// Define the expected types for your query results
interface AboutPageData {
  siteSettings: {
    aboutPageTitle?: string;
    aboutPageHeroImage?: ImageObject;
  };
  companySettings: {
    slogan?: string;
    aboutHistory?: string;
    aboutMission?: string;
    aboutFounder?: string;
    founderImage?: ImageObject;
    aboutTeam?: string;
    teamImage?: ImageObject;
  };
}

export const metadata: Metadata = {
  title: 'About Us | Vanta Construction',
  description: 'Learn about Vanta Construction, our history, mission and team.',
}

export default async function AboutPage() {
  // Fetch about page data with proper typing
  const data = await client.fetch<AboutPageData>(QUERY_ABOUT_PAGE);
  
  // Use nullish coalescing to provide defaults if entire objects are missing
  const siteSettings = data?.siteSettings ?? {};
  const companySettings = data?.companySettings ?? {};
  
  return (
    <>
      <AboutHero
        title={siteSettings.aboutPageTitle ?? "About Vanta Construction"}
        heroImage={(siteSettings.aboutPageHeroImage as ImageObject) ?? null}
      />
      
      <AboutContent
        slogan={companySettings.slogan ?? null}
        history={companySettings.aboutHistory ?? null}
        mission={companySettings.aboutMission ?? null}
      />
      
      <AboutTeam
        founderDescription={companySettings.aboutFounder ?? null}
        founderImage={(companySettings.founderImage as ImageObject) ?? null}
        teamDescription={companySettings.aboutTeam ?? null}
        teamImage={(companySettings.teamImage as ImageObject) ?? null}
      />
    </>
  )
}