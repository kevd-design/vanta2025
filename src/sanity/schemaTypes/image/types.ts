import { ToastContextValue } from '@sanity/ui'
import { 
  Image, 
  ImageDimensions, 
  ImageMetadata, 
  SanityClient, 
  ImageValue, 
  ObjectInputProps, 
  ObjectSchemaType 
} from 'sanity'
/** # Image with Metadata
 *
 * extends the Sanity Image Value with metadata. 
 * Use the same type in your front end, if you want to use the metadata.
 * Use the extendedQuery to get all the metadata from the image asset.
 *
 * @param {MetadataImage['_id']} _id is the alt text of the image and used as the _ref in image fields
 * @param {MetadataImage['title']} title is the alt text (set by media browser)
 * @param {MetadataImage['altText']} altText is the alt text (set by media browser)
 * @param {MetadataImage['description']} description is the description (set by media browser)
 * @param {MetadataImage['imageDimensions']} imageDimensions are the dimensions of the image
 * @param {Image['blurHashURL']} blurHashURL is the lqip string of the image metadata
 * @param {Image['asset']} asset is the asset of the image 
 * @see {@link Image} - Sanity Image
 * 
 * ---- 
 * 
 * ## Sanity Image Type:
 *
 * ```ts
 *  declare interface Image {
 *    [key: string]: unknown
 *    asset?: Reference
 *    crop?: ImageCrop
 *    hotspot?: ImageHotspot
 *  }
 * ```
 *
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

/** Field configuration for metadata inputs */
export interface Field {
  name: string
  title: string
  required?: boolean
}

/** Props for the ImageInput component */
export type ImageInputProps = ObjectInputProps<ImageValue, ObjectSchemaType>
/** Validation status record type */
export type ValidationStatus = Record<string, boolean>

/** Filename validation result */
export interface FilenameValidation {
  isValid: boolean
  error: string | null
}

/** Dialog states interface */
export interface DialogStates {
  open: boolean
  showConfirmDialog: boolean
  openFilenameDialog: boolean
}

/** Temporary states interface */
export interface TempStates {
  tempMetadata: MetadataImage | null
  tempFilename: string
  isFilenameValid: boolean
  filenameError: string | null
}

export interface FilenameDialogProps {
  isOpen: boolean
  onClose: () => void
  initialFilename: string
  onSave: (filename: string) => void
}

export interface MetadataDialogProps {
 isOpen: boolean
  onClose: () => void
  fields: Field[]                              
  initialData: Partial<MetadataImage> | null   
  onSave: (data: Partial<MetadataImage>) => void
}

export interface DecorativeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (confirmed: boolean) => void
}