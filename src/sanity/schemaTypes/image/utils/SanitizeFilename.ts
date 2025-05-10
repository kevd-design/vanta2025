import { FilenameValidation } from '../types'

/**
 * Sanitizes a filename for use in the Sanity image asset store.
 * Converts spaces and special characters to hyphens, transforms to lowercase.
 * 
 * @param filename - Original filename to sanitize (e.g., "My Image.jpg")
 * @param extension - Optional file extension to preserve (e.g., "jpg")
 * @returns Sanitized filename (e.g., "my-image.jpg")
 * 
 * @example
 * sanitizeFilename("My Cool Image!.jpg")
 * // Returns: "my-cool-image.jpg"
 * 
 * sanitizeFilename("Screenshot 2023", "png")
 * // Returns: "screenshot-2023.png"
 */


export const sanitizeFilename = (filename: string, extension?: string): string => {
  // Split current filename and only take the name part
  const name = filename.split('.')[0];
  
  // Sanitize the name part
  const sanitizedName = name
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  // Always use the asset's extension
  return extension ? `${sanitizedName}.${extension}` : sanitizedName;
};

/**
 * Validates a filename
 * @param filename - The filename to validate
 * @returns Object containing validation result and error message if invalid
 */
export const validateFilename = (filename: string): FilenameValidation => {
  // Check for empty filename
  if (!filename || filename.trim() === '') {
    return { 
      isValid: false, 
      error: 'Filename is required' 
    };
  }

  // Split filename and check name part
  const [name] = filename.split('.');
  if (!name || name.trim() === '') {
    return { 
      isValid: false, 
      error: 'Filename must contain text before the extension' 
    };
  }

  return { 
    isValid: true, 
    error: null 
  };
};