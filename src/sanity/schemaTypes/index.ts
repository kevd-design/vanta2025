import { type SchemaTypeDefinition } from 'sanity';

import metaData from './metaData';
import project from './project';
import pages from './pages';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    metaData,
    pages,
    project
  ],
  
}
