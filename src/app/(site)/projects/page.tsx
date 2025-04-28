
import { PROJECTS_QUERY } from '@/sanity/lib/queries';
import { client } from "@/sanity/lib/client";
import Link from "next/link"
import type { PROJECTS_QUERYResult } from "@/sanity/types"


export default async function Projects() {
  const projects:PROJECTS_QUERYResult = await client.fetch(PROJECTS_QUERY)
  return (
    <div>
        Projects
        <ul>
          {projects.map((project) => (
            <li key={project._id} className="border-b border-gray-200 py-4">
              {project.projectSlug?.current ? (
                <Link href={`/projects/${project.projectSlug.current}`}>
                  <h2 className="text-lg font-semibold">{project.projectName}</h2>
                </Link>
              ) : (
                <span className="text-gray-500">Invalid Project Slug</span>
              )}
  
            </li>
          ))}
        </ul>      

        
    </div>
  );
}