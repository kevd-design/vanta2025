import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = defineQuery(`*[
  _type == "project" && defined(projectSlug.current)][0...12]{
    _id, projectName, projectSlug
  }
`);

export const PROJECT_QUERY = defineQuery(`*[
  _type == "project" && projectSlug.current == $slug][0]{
    _id, projectName, projectSlug, projectDescription
  }
`);
    