import { useState, useCallback } from 'react'
import { DialogStates } from '../types'

/**
 * Hook for managing dialog states and callbacks in the image input component.
 * Handles metadata, filename, and decorative confirmation dialogs.
 * 
 * @returns Object containing:
 *   - showConfirmDialog: State for decorative mode confirmation dialog
 *   - setShowConfirmDialog: Function to toggle confirmation dialog
 *   - openFilenameDialog: State for filename edit dialog
 *   - setOpenFilenameDialog: Function to toggle filename dialog
 *   - open: State for metadata edit dialog
 *   - setOpen: Function to toggle metadata dialog
 *   - onClose: Callback to close metadata dialog
 *   - onOpen: Callback to open metadata dialog
 *   - handleFilenameDialogOpen: Callback to open filename dialog
 * 
 * @example
 * const {
 *   showConfirmDialog,
 *   setShowConfirmDialog,
 *   openFilenameDialog,
 *   onOpen,
 *   onClose
 * } = useDialogState()
 */

export const useDialogState = () => {
  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState<DialogStates['showConfirmDialog']>(false)
  const [openFilenameDialog, setOpenFilenameDialog] = useState<DialogStates['openFilenameDialog']>(false)
  const [open, setOpen] = useState<DialogStates['open']>(false)

  // Dialog callbacks
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])
  const handleFilenameDialogOpen = useCallback(() => setOpenFilenameDialog(true), [])

  return {
    // States
    showConfirmDialog,
    setShowConfirmDialog,
    openFilenameDialog,
    setOpenFilenameDialog,
    open,
    setOpen,
    // Callbacks
    onClose,
    onOpen,
    handleFilenameDialogOpen
  }
}