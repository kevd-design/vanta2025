import { useToast,  Grid } from '@sanity/ui'
import { ComponentType } from 'react'
import { pathToString, useClient, useFormValue } from 'sanity'
import { ImageInputProps} from '../types'
import { createMetadataFields } from '../utils/createMetadataFields'
import { useImageData } from '../hooks/useImageData'
import { useDialogState } from '../hooks/useDialogState'
import { useDecorativeMode } from '../hooks/useDecorativeMode'
import { useImageHandlers } from '../hooks/useImageHandlers'
import { FilenameDialog } from './dialogs/FilenameDialog'
import { MetadataDialog } from './dialogs/MetadataDialog'
import { DecorativeDialog } from './dialogs/DecorativeDialog'
import { MetadataCard } from './cards/MetadataCard'
import { FilenameCard } from './cards/FilenameCard'

/**
 * Custom input component for Sanity image fields.
 * Extends default image input with metadata editing capabilities.
 * 
 * Based on the Sanity image input component, this custom input
 * allows users to edit image metadata, manage filenames, and toggle
 * decorative image settings. It provides a user-friendly interface
 * for managing image assets within the Sanity Studio.
 * @see {@link https://www.sanity.io/guides/awesome-custom-input-component-for-metadata}
 *
 * Features:
 * - Metadata editing (title, alt text)
 * - Filename management
 * - Decorative image toggle
 * - Real-time metadata validation
 * - Asset metadata synchronization
 * 
 * @param props Object containing:
 *   - value: Current image field value
 *   - onChange: Callback for updating document
 *   - path: Path to field in document
 *   - schemaType: Schema definition for the field
 * 
 * @example
 * <ImageInput
 *   value={props.value}
 *   onChange={props.onChange}
 *   path={['image']}
 *   schemaType={schemaType}
 * />
 */

const ImageInput: ComponentType<ImageInputProps> = (props: ImageInputProps)  => {

  /** Initialize Sanity client with API version */
  const client = useClient({ apiVersion: '2023-03-25' })

  /** Toast notification handler
 * @see {@link https://www.sanity.io/ui/docs/component/toast}
 */
  const toast = useToast()

  /** Document ID from form context */
  const docId = useFormValue(['_id']) as string

  /** Reference to the Sanity image asset */
  const imageId = props.value?.asset?._ref

  /** Track changes to trigger revalidation
   * Used to toggle metadata validation state in document
   */
  const changed = (useFormValue([pathToString(props.path), 'changed']) as boolean) ?? false

  /** Fetch and manage image metadata state
   * Provides current image data and original metadata for restoration
   */
  const { sanityImage, setSanityImage, originalMetadata } = useImageData({ 
    imageId, 
    client 
  })

  /** Manage dialog visibility states and handlers
   * Controls metadata, filename, and decorative mode dialogs
   */
  const {
  showConfirmDialog,
  setShowConfirmDialog,
  openFilenameDialog,
  setOpenFilenameDialog,
  open,
  onClose,
  onOpen,
  handleFilenameDialogOpen
} = useDialogState()

/** Handle decorative image mode
   * Manages metadata clearing/restoration when toggling decorative mode
   */
 const { handleDecorativeConfirm, isDecorative } = useDecorativeMode({
    value: props.value,
    onChange: props.onChange,
    sanityImage,
    setSanityImage,
    originalMetadata,
    setShowConfirmDialog
  })

  /** Handle metadata and filename updates
   * Manages state updates and API calls for metadata changes
   */
  const { handleMetadataSave, handleFilenameSave } = useImageHandlers({
  sanityImage,
  setSanityImage,
  client,
  docId,
  changed,
  path: props.path,
  toast,
  onClose,
  setOpenFilenameDialog
})
  
/** Generate metadata fields based on schema configuration */
  const fields = createMetadataFields(props.schemaType?.options?.requiredFields)
  

  return (
    <div>
      {/* Render default Sanity image input */}
      {props.renderDefault(props)}

      {/* Metadata and filename editing cards */}
      <Grid columns={2} gap={4} marginTop={4}>
        {/* Metadata Column */}
          <MetadataCard
            sanityImage={sanityImage}
            isDecorative={isDecorative}
            imageId={imageId}
            onOpen={onOpen}
          />

        {/* Filename Column */}
          <FilenameCard
            sanityImage={sanityImage}
            imageId={imageId}
            onOpen={handleFilenameDialogOpen}
          />
      </Grid>

      {/* Edit dialogs */}
      <FilenameDialog
        isOpen={openFilenameDialog}
        onClose={() => setOpenFilenameDialog(false)}
        initialFilename={sanityImage?.originalFilename ?? ''}
        onSave={handleFilenameSave}
      />   

      {showConfirmDialog && (
      <DecorativeDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDecorativeConfirm}
      />
      )}
      {open && (
        <MetadataDialog
          isOpen={open}
          onClose={onClose}
          fields={fields}
          initialData={sanityImage}
          onSave={handleMetadataSave}
        />
      )}
    </div>
  )
}

export default ImageInput