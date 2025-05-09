import { FilenameValidation } from '../types'

/**
 * Sanitizes a filename by removing special characters and spaces
 * @param filename - The filename to sanitize
 * @param extension - Optional file extension to preserve
 * @returns sanitized filename with extension if provided
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