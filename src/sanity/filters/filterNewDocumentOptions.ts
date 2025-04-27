import { TemplateItem } from 'sanity'

export function filteredOptions(originalNewDocList: TemplateItem[]) {
  return originalNewDocList.filter(option => {
    const schemaType = option?.templateId
    // Allow creation of non-singleton documents
    if (!schemaType || !schemaType.endsWith('Singleton')) {
      return true
    }
    // Filter out singleton document types
    return false
  })
}
