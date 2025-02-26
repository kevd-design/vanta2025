'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { myStructure } from './src/sanity/newStructure'
// import { structure } from './src/sanity/structure'
// import { preventPublish } from './src/sanity/filters/preventPublish'
import { filterNewDocumentOptions } from './src/sanity/filters/filterNewDocumentOptions'



export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  document: {
    // actions: (prev, context) => {
    //   return preventPublish(prev, context)
    // },
    newDocumentOptions: (prev) => {
        return filterNewDocumentOptions(prev);

    },

  },
  schema,
  plugins: [
    structureTool({structure: myStructure}),
    // structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  

})

