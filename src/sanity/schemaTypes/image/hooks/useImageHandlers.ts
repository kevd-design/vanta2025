import { useCallback } from 'react'
import { pathToString } from 'sanity'
import { MetadataImage, UseImageHandlersProps, ImageHandlers } from '../types'
import { handleGlobalMetadataConfirm } from '../utils/handleGlobalMetadataConfirm'

/**
 * Hook for handling image metadata and filename updates.
 * Manages state updates and API calls for both metadata and filename changes.
 * 
 * @param props Object containing required dependencies and callbacks
 * @returns Object with handler functions for metadata and filename updates
 * 
 * @example
 * const { handleMetadataSave, handleFilenameSave } = useImageHandlers({
 *   sanityImage,
 *   setSanityImage,
 *   client,
 *   docId,
 *   changed,
 *   path,
 *   toast,
 *   onClose,
 *   setOpenFilenameDialog
 * })
 */
export const useImageHandlers = ({
  sanityImage,
  setSanityImage,
  client,
  docId,
  changed,
  path,
  toast,
  onClose,
  setOpenFilenameDialog
}: UseImageHandlersProps): ImageHandlers => {
  
  const handleMetadataSave = useCallback((updatedMetadata: Partial<MetadataImage>) => {
    // Update local state
    setSanityImage((prev: MetadataImage | null) => {
        if (!prev) return null
        return {
        ...prev,
        ...updatedMetadata,
        _id: prev._id
        }
    })
    
    // Update Sanity if we have an image
    if (sanityImage) {
      const updatedImage: MetadataImage = {
        ...sanityImage,
        ...updatedMetadata,
        _id: sanityImage._id
      }
      
      handleGlobalMetadataConfirm({
        sanityImage: updatedImage,
        toast,
        client,
        onClose,
        docId,
        changed,
        imagePath: pathToString(path),
      })
    }
  }, [sanityImage, setSanityImage, client, docId, changed, path, onClose, toast])

  const handleFilenameSave = useCallback((newFilename: string) => {
    if (!sanityImage) return
    
    // Update local state
    const updatedImage: MetadataImage = {
      ...sanityImage,
      originalFilename: newFilename
    }
    setSanityImage(updatedImage)
    
    // Update Sanity
    handleGlobalMetadataConfirm({
      sanityImage: updatedImage,
      toast,
      client,
      onClose: () => setOpenFilenameDialog(false),
      docId,
      changed,
      imagePath: pathToString(path),
    })
  }, [sanityImage, setSanityImage, client, docId, changed, path, toast, setOpenFilenameDialog])

  return {
    handleMetadataSave,
    handleFilenameSave
  }
}