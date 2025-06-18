import { sanityFetch } from "@/sanity/lib/live";
import { HomepageHero } from '@/app/components/HomepageHero'
import { Project } from '@/app/components/Project' // Updated import
import { Services } from '@/app/components/Services'
import { Review } from '@/app/components/Review'
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
    linkLabel: data.projectCTA.linkLabel || "Explore this project",
    linkType: data.projectCTA.linkType || "toProject",
    toProjectSlug: projectSlug,
    toPage: data.projectCTA.toPage,
    externalLink: data.projectCTA.externalLink
  } : null;

  return (
    <main>
      <HomepageHero
        image={data.heroImage as ImageObject | null}
        headline={data.heroHeadline}
        cta={data.heroCTA as CTAType | null}
      />
      
      {featuredProject && (
        <Project // Using the renamed component
          title={projectName}
          slug={projectSlug}
          image={projectImage as ImageObject} // Updated prop name from featuredImage to image
          cta={projectCTA}
        />
      )}
      
      <Services
        title={data.servicesTitle}
        description={data.servicesDescription}
        backgroundImage={data.backgroundImageServices as ImageObject | null}
        cta={data.servicesCTA as CTAType | null}
      />
      
      <Review
        reviewerName={data.reviewerName}
        reviewText={data.reviewText}
        cta={data.reviewCTA as CTAType | null}
      />
    </main>
  );
}

