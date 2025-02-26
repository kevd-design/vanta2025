import { type SchemaTypeDefinition } from 'sanity';

import metaData from './metaData';
import pages from './pages';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    metaData,
    pages
  ],
}
