import {
  Dialog,
  Card,
  Stack,
  Label,
  TextInput,
  Text,
  Flex,
  Button
} from '@sanity/ui'

import { useState, useEffect } from 'react'
import { FilenameDialogProps } from '../../types'
import { sanitizeFilename, validateFilename } from '../../utils/SanitizeFilename'

/**
 * Dialog component for editing image filenames.
 * Handles filename validation, sanitization, and submission.
 * 
 * @param props Object containing:
 *   - isOpen: Boolean to control dialog visibility
 *   - onClose: Callback function to handle dialog close
 *   - initialFilename: Current filename to edit
 *   - onSave: Callback function that receives sanitized filename
 * 
 * @example
 * <FilenameDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   initialFilename="current-image.jpg"
 *   onSave={(filename) => handleSave(filename)}
 * />
 */

export const FilenameDialog = ({
  isOpen,
  onClose,
  initialFilename,
  onSave
}: FilenameDialogProps) => {

    const [tempFilename, setTempFilename] = useState('')
    const [isValid, setIsValid] = useState(true)
    const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
        setTempFilename(initialFilename)
        setIsValid(true)
        setError(null)
    }
    }
    , [isOpen, initialFilename])

    const handleChange = (value: string) => {
    setTempFilename(value)
    const validationResult = validateFilename(value)
    setIsValid(validationResult.isValid)
    setError(validationResult.error)
  }

   const handleBlur = () => {
    const sanitized = sanitizeFilename(tempFilename)
    setTempFilename(sanitized)
    const validationResult = validateFilename(sanitized)
    setIsValid(validationResult.isValid)
    setError(validationResult.error)
  }

  const handleSubmit = () => {
    if (isValid && tempFilename) {
      onSave(tempFilename)
      onClose()
    }
  }

   if (!isOpen) return null

  return (
    <Dialog
      header="Edit filename"
      id="dialog-filename-edit"
      onClose={onClose}
      zOffset={1000}
      width={2}
    >
      <Card padding={4}>
        <Stack space={4}>
          <Card paddingBottom={4}>
            <label>
              <Stack space={3}>
                <Label muted size={1}>Filename</Label>
                <TextInput
                  id="image-filename"
                  fontSize={2}
                  onChange={(event) => handleChange(event.currentTarget.value)}
                  onBlur={handleBlur}
                  value={tempFilename}
                  placeholder="Enter filename"
                  customValidity={error ? 'error' : undefined}
                />
                {error && (
                  <Text size={1} style={{color: 'var(--card-critical-fg)'}}>
                    {error}
                  </Text>
                )}
                <Text size={1} muted>
                  Lowercase letters, numbers, and hyphens only. File extension will be preserved.
                </Text>
              </Stack>
            </label>
          </Card>
          <Flex gap={2} justify="flex-end">
            <Button
              mode="ghost"
              text="Cancel"
              onClick={onClose}
            />
            <Button
              tone="primary"
              text="Save filename"
              onClick={handleSubmit}
              disabled={!isValid || !tempFilename}
            />
          </Flex>
        </Stack>
      </Card>
    </Dialog>
  )
}