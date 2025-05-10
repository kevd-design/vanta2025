import { useCallback, useEffect } from 'react'
import { PatchEvent, set } from 'sanity'
import { UseDecorativeModeProps, DecorativeModeReturn } from '../types'


/**
 * Hook for managing decorative image mode in Sanity image fields.
 * Handles metadata clearing/restoration when toggling decorative status.
 * Used in conjunction with DecorativeDialog for user confirmation.
 * 
 * @param props Object containing:
 *   - value: Current form value with decorative flag
 *   - onChange: Callback for updating Sanity document
 *   - sanityImage: Current image metadata from asset
 *   - setSanityImage: Function to update image metadata state
 *   - originalMetadata: Initial metadata for restoration when turning off decorative mode
 *   - setShowConfirmDialog: Function to toggle the confirmation dialog
 * 
 * @returns Object containing:
 *   - handleDecorativeConfirm: Callback for handling dialog confirmation
 *   - isDecorative: Boolean indicating if image is currently decorative
 * 
 * @example
 * const { handleDecorativeConfirm, isDecorative } = useDecorativeMode({
 *   value: props.value,
 *   onChange: props.onChange,
 *   sanityImage,
 *   setSanityImage,
 *   originalMetadata,
 *   setShowConfirmDialog
 * })
 */



export const useDecorativeMode = ({
  value,
  onChange,
  sanityImage,
  setSanityImage,
  originalMetadata,
  setShowConfirmDialog
}: UseDecorativeModeProps): DecorativeModeReturn => {
  
    // Handle confirmation of decorative mode toggle
const handleDecorativeConfirm = useCallback((confirmed: boolean) => {
  if (confirmed) {
    // Clear metadata when switching to decorative
    if (sanityImage) {
      setSanityImage({
        ...sanityImage,
        altText: '',
        title: ''
      });
    }
    // Update document value if it exists
    if (value) {
        onChange(PatchEvent.from([
          set({
            ...value,
            decorative: true
          })
        ]));
      }
  } else {
      // Reset decorative flag
      if (value) {
        onChange(PatchEvent.from([
          set({
            ...value,
            decorative: false
          })
        ]));
      }
    }
  setShowConfirmDialog(false);
}, [onChange, value, setSanityImage, setShowConfirmDialog, sanityImage]);

// Watch for decorative mode changes and restore metadata
useEffect(() => {
    // Only run if we're switching from decorative to non-decorative
    // and we have both original metadata and current image
  if (!value?.decorative && originalMetadata && sanityImage) {
    const shouldRestore = value?.decorative === false && 
        (!sanityImage.title || !sanityImage.altText)

    if (shouldRestore) {
      setSanityImage({
        ...sanityImage,
        altText: originalMetadata.altText || '',
        title: originalMetadata.title || ''
      });
    }
  } 
}, [value?.decorative, originalMetadata, setSanityImage, sanityImage]);



  // Watch for metadata changes that might need confirmation
    useEffect(() => {
      const hasMetadata = Boolean(sanityImage?.altText || sanityImage?.title)  
    if (value?.decorative && hasMetadata) {
      setShowConfirmDialog(true)
    }
    }, [value?.decorative, sanityImage?.altText, sanityImage?.title, setShowConfirmDialog])

  return {
    handleDecorativeConfirm,
    isDecorative: Boolean(value?.decorative)
  } 
}