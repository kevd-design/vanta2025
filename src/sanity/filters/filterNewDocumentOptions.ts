import { client } from '../lib/client'
import { TemplateItem } from 'sanity'

// Fetch all documents whose _type matches the naming convention (ending in "Singleton")
const existingSingletons: string[] = await client.fetch(
  `*[_type match $pattern][]._type`,
  { pattern: "*Singleton" }
)
const existingTypes = new Set(existingSingletons)


export function filteredOptions(originalNewDocList: TemplateItem[]) {
  const filteredOptions = originalNewDocList.filter(option => {
    const schemaType = option?.templateId
    // Use the naming convention to detect singleton schema types.
    if (schemaType && schemaType.endsWith("Singleton")) {
      // If a singleton of that type already exists, filter it out.
      return !existingTypes.has(schemaType)
    }
    return true
  })
  return filteredOptions
}

