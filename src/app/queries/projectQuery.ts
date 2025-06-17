import { defineQuery } from "next-sanity"
import { IMAGE_WITH_METADATA } from "./fragments/imageFragment"

export const QUERY_PROJECTS = defineQuery(`*[
  _type == "project" && defined(projectSlug.current)][0...12]{
    _id, 
    projectName, 
    projectSlug,
    projectImage {${IMAGE_WITH_METADATA}}
  }
`);

export const QUERY_PROJECT = defineQuery(`*[
  _type == "project" && projectSlug.current == $slug][0]{
    _id, 
    projectName, 
    projectSlug, 
    projectDescription,
    projectImage {${IMAGE_WITH_METADATA}},
    projectNeighbourhood->{
      name
    },
    projectGallery[] {${IMAGE_WITH_METADATA}}
  }
`);

// Query to fetch the project index page metadata
export const QUERY_PROJECT_INDEX_METADATA = defineQuery(`*[_type == "siteSettingsSingleton"][0]{
  projectIndexPageTitle,
  projectIndexPageDescription
}`);