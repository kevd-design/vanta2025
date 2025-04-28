import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
  
}) {
  const { data: project } = await sanityFetch({
    query: PROJECT_QUERY,
    params: await params,
  });
  
  if (!project) {
    notFound();
  }


  return (
    <div>
      <h1>{project?.projectName}</h1>
      <p>{project?.projectDescription}</p>
      <Link href="/projects">
      &larr; Return to Projects
      </Link>
      
    </div>
  );
}