import { sanityFetch } from "@/sanity/lib/live";
import { Hero } from '@/app/components/Hero'
import { FeaturedProject } from '@/app/components/FeaturedProject'
import { Services } from '@/app/components/Services'
import { QUERY_HOME } from '@/app/queries/homeQuery';
import type { CTAType } from '@/app/lib/types/content'
import type { ImageObject } from '@/app/lib/types/image';


export default async function Home() {

    // Fetch the data from Sanity
  const res = await sanityFetch({ query: QUERY_HOME });
  const data = res.data;
  
  if (!data) {
    return <div>Page data is missing. Please check Sanity content.</div>;
  }

  // Safely extract the featured project data with null checks
  const featuredProject = data.projectCTA?.project || null;
  const projectSlug = featuredProject?.projectSlug?.current || null;
  const projectName = featuredProject?.projectName || null;
  const projectImage = featuredProject?.projectImage || null;
  
  // Create a proper CTA object that includes toProjectSlug
  const projectCTA = data.projectCTA ? {
    linkLabel: data.projectCTA.linkLabel || "Explore this project", // Fallback text
    linkType: data.projectCTA.linkType || "toProject", // Default to project link type 
    toProjectSlug: projectSlug, // Use the current project's slug
    // Include these other properties in case they're needed
    toPage: data.projectCTA.toPage,
    externalLink: data.projectCTA.externalLink
  } : null;

  return (
    <main>
      <Hero
        image={data.heroImage as ImageObject | null}
        headline={data.heroHeadline}
        cta={data.heroCTA as CTAType | null}
      />
      
      {featuredProject && (
        <FeaturedProject
          title={projectName}
          slug={projectSlug}
          featuredImage={projectImage as ImageObject}
          cta={projectCTA}
        />
      )}
      
      <Services
        title={data.servicesTitle}
        description={data.servicesDescription}
        backgroundImage={data.backgroundImageServices as ImageObject | null}
        cta={data.servicesCTA as CTAType | null}
      />
      content
    </main>
  );
}

