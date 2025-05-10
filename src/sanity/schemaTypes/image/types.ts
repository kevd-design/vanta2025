import { ToastContextValue } from '@sanity/ui'
import { 
  Image, 
  ImageDimensions, 
  ImageMetadata, 
  SanityClient, 
  ImageValue, 
  ObjectInputProps, 
  ObjectSchemaType,
  PatchEvent,
  Path,
} from 'sanity'
/**
 * Extended Sanity Image type with additional metadata fields.
 * Used for managing image assets with enhanced metadata support.
 * 
 * @param title Optional title for the image, used for SEO and accessibility
 * @param altText Optional alt text for the image, used for accessibility
 * @param description Optional description of the image content
 * @param _id Unique identifier for the image asset
 * @param originalFilename Original filename of the uploaded image
 * @param imageDimensions Optional width and height of the image
 * @param blurHashURL Optional low-quality image placeholder (LQIP)
 * @param asset Optional reference to Sanity image asset
 * @param crop Optional cropping information
 * @param hotspot Optional focal point information
 * 
 * @example
 * // Basic image metadata
 * const basicImage: MetadataImage = {
 *   _id: 'image-123',
 *   originalFilename: 'hero.jpg',
 *   title: 'Hero Image',
 *   altText: 'A scenic mountain view'
 * }
 * 
 * // Image with all metadata
 * const fullImage: MetadataImage = {
 *   _id: 'image-456',
 *   originalFilename: 'profile.jpg',
 *   title: 'Profile Photo',
 *   altText: 'Person smiling at camera',
 *   description: 'Professional headshot on blue background',
 *   imageDimensions: { width: 800, height: 600 },
 *   blurHashURL: 'data:image/jpeg;base64,...',
 *   asset: { _ref: 'image-456-800x600-jpg', _type: 'reference' }
 * }
 * 
 * @see {@link https://www.sanity.io/docs/image-type} - Sanity Image Type Documentation
 */
export interface MetadataImage extends Image {
  title?: string
  altText?: string
  description?: string
  _id: string
  originalFilename: string
  imageDimensions?: ImageDimensions
  blurHashURL?: ImageMetadata['lqip']
}

/** # GlobalMetadataHandlerProps
 *
 * This is the type of the props passed to the global metadata handler.
 *
 * @param {MetadataImage} sanityImage is the image object with metadata
 * @param {ToastContextValue} toast is the toast context from the Sanity UI
 * @param {SanityClient} client is the Sanity client
 * @param {() => void} onClose is the function to close the dialog
 * @param {string} docId is the document id of the document that contains the image
 * @param {boolean} changed is a boolean that indicates if the image has changed
 * @param {string} imagePath is the path to the image
 *
 */
export interface GlobalMetadataHandlerProps {
  sanityImage: MetadataImage
  toast: ToastContextValue
  client: SanityClient
  onClose: () => void
  docId: string
  changed: boolean
  imagePath: string
}

/** Field configuration for metadata inputs 
 * @param name Field identifier used as key in metadata object
 * @param title Display name shown in UI
 * @param required Whether the field is required for validation
 */
export interface Field {
  name: string
  title: string
  required?: boolean
}

/** Props for the ImageInput component 
 * Extends Sanity's ObjectInputProps with ImageValue and ObjectSchemaType
 */
export type ImageInputProps = ObjectInputProps<ImageValue, ObjectSchemaType>

/** Record mapping field names to their validation status
 * @example { title: true, altText: false }
 */
export type ValidationStatus = Record<string, boolean>

/** Result of filename validation check
 * @param isValid Whether filename meets requirements
 * @param error Error message if validation fails
 */
export interface FilenameValidation {
  isValid: boolean
  error: string | null
}

/** State management for dialog visibility
 * @param open Controls metadata dialog visibility
 * @param showConfirmDialog Controls decorative mode confirmation dialog
 * @param openFilenameDialog Controls filename edit dialog
 */
export interface DialogStates {
  open: boolean
  showConfirmDialog: boolean
  openFilenameDialog: boolean
}

/** Temporary state storage for form values and validation
 * @param tempMetadata Draft metadata changes before saving
 * @param tempFilename Draft filename before saving
 * @param isFilenameValid Current filename validation status
 * @param filenameError Current filename validation error message
 */
export interface TempStates {
  tempMetadata: MetadataImage | null
  tempFilename: string
  isFilenameValid: boolean
  filenameError: string | null
}

/** Props for FilenameDialog component
 * @param isOpen Controls dialog visibility
 * @param onClose Handler for closing dialog
 * @param initialFilename Starting filename value
 * @param onSave Callback receiving new filename
 */
export interface FilenameDialogProps {
  isOpen: boolean
  onClose: () => void
  initialFilename: string
  onSave: (filename: string) => void
}

/**
 * Props for FilenameCard component
 * @param sanityImage Current image metadata
 * @param imageId Sanity image asset reference ID
 * @param onOpen Handler for opening filename dialog
 */
export interface FilenameCardProps {
  sanityImage: MetadataImage | null
  imageId: string | undefined
  onOpen: () => void
}

/** Props for MetadataDialog component
 * @param isOpen Controls dialog visibility
 * @param onClose Handler for closing dialog
 * @param fields Array of metadata fields to display
 * @param initialData Starting metadata values
 * @param onSave Callback receiving updated metadata
 */
export interface MetadataDialogProps {
 isOpen: boolean
  onClose: () => void
  fields: Field[]                              
  initialData: Partial<MetadataImage> | null   
  onSave: (data: Partial<MetadataImage>) => void
}

/**
 * Props for MetadataCard component
 * @param sanityImage Current image metadata
 * @param isDecorative Whether the image is decorative
 * @param imageId Sanity image asset reference ID
 * @param onOpen Handler for opening metadata dialog
 */
export interface MetadataCardProps {
  sanityImage: MetadataImage | null
  isDecorative: boolean
  imageId: string | undefined
  onOpen: () => void
}

/** Props for DecorativeDialog component
 * @param isOpen Controls dialog visibility
 * @param onClose Handler for closing dialog
 * @param onConfirm Callback receiving confirmation result
 */
export interface DecorativeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (confirmed: boolean) => void
}

/** Props for useImageData hook
 * @param imageId Sanity image asset reference ID
 * @param client Sanity client instance for API operations
 */
export interface UseImageDataProps {
  imageId: string | undefined
  client: SanityClient
}

/**
 * Props for useDecorativeMode hook
 * @param value Current form value with decorative flag
 * @param onChange Callback for updating form value
 * @param sanityImage Current image metadata
 * @param setSanityImage Function to update image metadata
 * @param originalMetadata Initial metadata for restoration
 * @param setShowConfirmDialog Function to toggle confirmation dialog
 */

export interface UseDecorativeModeProps {
  value: ImageValue | undefined 
  onChange: (patch: PatchEvent) => void
  sanityImage: MetadataImage | null
  setSanityImage: (image: MetadataImage | null) => void
  originalMetadata: MetadataImage | null
  setShowConfirmDialog: (show: boolean) => void
}

/**
 * Return type for useDecorativeMode hook
 * Provides functions and state for managing decorative image mode
 * 
 * @param handleDecorativeConfirm Function to handle decorative mode confirmation
 * @param isDecorative Current decorative mode state
 * 
 * @example
 * const { handleDecorativeConfirm, isDecorative } = useDecorativeMode({
 *   value: imageValue,
 *   onChange: handleChange,
 *   sanityImage: currentImage,
 *   setSanityImage: setImage,
 *   originalMetadata: metadata,
 *   setShowConfirmDialog: setDialog
 * })
 */
export interface DecorativeModeReturn {
  handleDecorativeConfirm: (confirmed: boolean) => void
  isDecorative: boolean
}

/**
 * Props for useImageHandlers hook
 * Manages metadata and filename updates for Sanity images
 * 
 * @param sanityImage Current image metadata
 * @param setSanityImage Function to update image state
 * @param client Sanity client instance for API operations
 * @param docId Document ID to update changed flag
 * @param changed Boolean flag to toggle for revalidation
 * @param path Path to image field in document
 * @param toast Toast notification handler
 * @param onClose Handler for closing metadata dialog
 * @param setOpenFilenameDialog Function to toggle filename dialog
 * 
 * @example
 * const { handleMetadataSave, handleFilenameSave } = useImageHandlers({
 *   sanityImage: currentImage,
 *   setSanityImage: setImage,
 *   client: sanityClient,
 *   docId: 'doc-123',
 *   changed: false,
 *   path: ['image'],
 *   toast: toastHandler,
 *   onClose: () => setOpen(false),
 *   setOpenFilenameDialog: setDialogOpen
 * })
 */
export interface UseImageHandlersProps {
  sanityImage: MetadataImage | null
  setSanityImage: (value: MetadataImage | ((prev: MetadataImage | null) => MetadataImage | null)) => void
  client: SanityClient
  docId: string
  changed: boolean
  path: Path
  toast: ToastContextValue
  onClose: () => void
  setOpenFilenameDialog: (open: boolean) => void
}

/**
 * Return type for useImageHandlers hook
 * Provides functions for updating image metadata and filename
 * 
 * @param handleMetadataSave Function to update image metadata
 * @param handleFilenameSave Function to update image filename
 * 
 * @example
 * // Update metadata
 * handleMetadataSave({ title: 'New Title', altText: 'New Alt Text' })
 * 
 * // Update filename
 * handleFilenameSave('new-filename.jpg')
 */
export interface ImageHandlers {
  handleMetadataSave: (metadata: Partial<MetadataImage>) => void
  handleFilenameSave: (filename: string) => void
}