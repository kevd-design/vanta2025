import { useCallback, useEffect, useRef } from 'react'
import { PatchEvent, set } from 'sanity'
import { UseDecorativeModeProps, DecorativeModeReturn } from '../types'

/**
 * Hook for managing decorative image mode and associated metadata.
 * Handles clearing/restoring metadata when toggling decorative mode.
 * 
 * @param props Object containing:
 *   - value: Current form value with decorative flag
 *   - onChange: Callback for updating form value
 *   - sanityImage: Current image metadata
 *   - setSanityImage: Function to update image metadata
 *   - originalMetadata: Initial metadata for restoration
 *   - setShowConfirmDialog: Function to toggle confirmation dialog
 * 
 * @returns Object containing:
 *   - handleDecorativeConfirm: Function to handle mode confirmation
 *   - isDecorative: Current decorative mode state
 * 
 * @example
 * const { handleDecorativeConfirm, isDecorative } = useDecorativeMode({
 *   value,
 *   onChange,
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
  // Keep track of dialog state to prevent loops
  const showConfirmDialogRef = useRef(false)
  
  const handleDecorativeConfirm = useCallback((confirmed: boolean) => {
    if (!value || !sanityImage) return

    if (confirmed) {
      // Clear metadata when switching to decorative
      setSanityImage({
        ...sanityImage,
        altText: '',
        title: ''
      })
      
      // Update document
      onChange(PatchEvent.from([
        set({
          ...value,
          decorative: true
        })
      ]))
    } else {
      // Reset decorative flag if not confirmed
      onChange(PatchEvent.from([
        set({
          ...value,
          decorative: false
        })
      ]))
    }
    
    setShowConfirmDialog(false)
    showConfirmDialogRef.current = false
  }, [onChange, value, setSanityImage, setShowConfirmDialog, sanityImage])

  useEffect(() => {
    if (!value || !sanityImage) return

    // Handle non-decorative mode
    if (!value.decorative && originalMetadata) {
      const needsRestore = !sanityImage.title || !sanityImage.altText
      const metadataChanged = 
        sanityImage.title !== originalMetadata.title || 
        sanityImage.altText !== originalMetadata.altText

      if (needsRestore && metadataChanged) {
        setSanityImage({
          ...sanityImage,
          altText: originalMetadata.altText || '',
          title: originalMetadata.title || ''
        })
      }
    } 
    // Handle decorative mode
    else if (value.decorative) {
      const hasMetadata = Boolean(sanityImage.altText || sanityImage.title)
      if (hasMetadata && !showConfirmDialogRef.current) {
        showConfirmDialogRef.current = true
        setShowConfirmDialog(true)
      }
    }
  }, [
    value?.decorative,
    originalMetadata,
    sanityImage,
    setSanityImage,
    setShowConfirmDialog,
    value
  ])

  return {
    handleDecorativeConfirm,
    isDecorative: Boolean(value?.decorative)
  }
}