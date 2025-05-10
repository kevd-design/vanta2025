import { Field } from '../types'

/**
 * Converts field names to metadata field objects with proper formatting
 * @param requiredFields Array of field names to be converted
 * @returns Array of Field objects with name, title, and required status
 */
export const createMetadataFields = (requiredFields: string[] = []): Field[] => {
  return requiredFields.map((fieldName: string) => ({
    name: fieldName,
    title: fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim(), // Remove any extra spaces
    required: true
  }))
}