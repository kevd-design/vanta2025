import { QUERY_PROJECTS, QUERY_PROJECT_INDEX_METADATA } from '@/app/queries/projectQuery';
import { sanityFetch } from "@/sanity/lib/live";
import { Project } from '@/app/components/Project';
import type { ImageObject } from '@/app/lib/types/image';
import type { SanityProject, ProjectIndexMetadata } from '@/app/lib/types/project';

export default async function Projects() {
  // Fetch all projects and page metadata in parallel
  const [projectsResponse, metadataResponse] = await Promise.all([
    sanityFetch({query: QUERY_PROJECTS}),
    sanityFetch({query: QUERY_PROJECT_INDEX_METADATA})
  ]);

  // Type assertion instead of generic parameter
  const projects = projectsResponse.data as SanityProject[];
  const metadata = metadataResponse.data as ProjectIndexMetadata;

  return (
    <main>
      {/* Removed border radius and reduced padding back to original */}
      <section className="bg-cream-100 mt-48">
        <div className="container mx-auto px-4">
          {/* Left alignment and large top margin preserved */}
          <div className="max-w-4xl text-left mt-20 md:mt-44">
            <h1 className="font-display text-4xl md:text-5xl text-stone-800">
              {metadata?.projectIndexPageTitle || "Our Projects"}
            </h1>
            
            {metadata?.projectIndexPageDescription && (
              <p className="text-lg text-stone-700">
                {metadata.projectIndexPageDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Map through the projects and alternate the layout */}
      {projects.map((project, index) => (
        <Project
          key={project._id}
          title={project.projectName}
          slug={project.projectSlug?.current || ""}
          image={project.projectImage as ImageObject}
          isAlternate={index % 2 !== 0}
        />
      ))}
    </main>
  );
}