import { sanityFetch } from "@/sanity/lib/live";
import { QUERY_PROJECT } from "@/app/queries/projectQuery";
import { notFound } from "next/navigation";
import { ProjectHero } from "@/app/components/ProjectHero";
import { ProjectGallery } from "@/app/components/ProjectGallery";
import type { Metadata } from "next";
import type { ImageObject } from "@/app/lib/types/image";

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: project } = await sanityFetch({
    query: QUERY_PROJECT,
    params: resolvedParams,
  });

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.projectName} | Vanta Construction`,
    description: project.projectDescription || 'Project details',
  };
}

// Page component - using the same Promise<{ slug: string }> type as your working example
export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const { data: project } = await sanityFetch({
    query: QUERY_PROJECT,
    params: resolvedParams,
  });
  
  if (!project) {
    notFound();
  }

  // Add a null check for asset before rendering - this is key
  if (project.projectImage && project.projectImage.asset === null) {
    project.projectImage = null;
  }

  return (
    <>
      <ProjectHero
        image={project.projectImage as ImageObject}
        headline={project.projectName}
        neighbourhoodName={project?.projectNeighbourhood?.name}
      />
      
      {/* Content section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <p className="text-lg text-stone-700 mb-8">{project?.projectDescription}</p>
      </section>
      
      {/* Add the gallery component if there are images */}
      {project.projectGallery && project.projectGallery.length > 0 && (
        <ProjectGallery 
          images={project.projectGallery as ImageObject[]} 
          title={project.projectName || "Project"} 
        />
      )}
    </>
  );
}