'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { myStructure } from './src/sanity/deskStructure'
// import { structure } from './src/sanity/structure'
import { preventPublish } from './src/sanity/actions/preventPublish'



export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  document: {
    actions: (prev, context) => {
      return preventPublish(prev, context)
    }
  },
  schema,
  plugins: [
    structureTool({ structure: myStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})

