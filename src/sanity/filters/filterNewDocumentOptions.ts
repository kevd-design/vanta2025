import { client } from '../lib/client'
import { TemplateItem } from 'sanity'


const SINGLETON_TYPES = ['metaData', 'pages']

export interface NewDocumentOption {
  schemaType?: string
  template?: { schemaType?: string }
  [key: string]: unknown
}

const existingSingletons: string[] = await client.fetch(
  `*[_type in $singletonTypes][]._type`,
  { singletonTypes: SINGLETON_TYPES }
)

const existingTypes = new Set(existingSingletons)
console.log('Existing singleton types:', Array.from(existingTypes))

function filteredOptions (originalNewDocList:TemplateItem[]) {
  const filteredOptions = originalNewDocList.filter(option => {
    const schemaType = option?.templateId
    if (schemaType && SINGLETON_TYPES.includes(schemaType)) {
      // If the singleton already exists, filter it out
      return !existingTypes.has(schemaType)
    }
    return true
  })

  console.log('Filtered new document options:', filteredOptions)
  return filteredOptions
}

export function filterNewDocumentOptions(prev: TemplateItem[]){
  console.log('Original new document options:', prev)

  return filteredOptions(prev)

}