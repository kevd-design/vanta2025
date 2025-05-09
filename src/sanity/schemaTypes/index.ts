import { type SchemaTypeDefinition } from 'sanity';

import companySettings from './companySettings';
import project from './project';
import pages from './pages';
import siteSettingsSingleton from './siteSettings';
import neighbourhood from './neighbourhood';
import callToAction from "./callToAction";
import { imageType } from './image/imageType';


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    companySettings,
    pages,
    project,
    siteSettingsSingleton,
    neighbourhood,
    callToAction,
    imageType
  ],
  
}
