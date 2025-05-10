import {
  Dialog,
  Card,
  Stack,
  Button,
  TextInput,
  Label,
  Text
} from '@sanity/ui'
import { useState, useEffect } from 'react'
import { MetadataDialogProps, Field, MetadataImage } from '../../types'

/**
 * Dialog component for editing image metadata (title, alt text, etc.).
 * Handles form state, validation, and submission of metadata fields.
 * 
 * @param props Object containing:
 *   - isOpen: Boolean to control dialog visibility
 *   - onClose: Callback function to handle dialog close
 *   - fields: Array of metadata fields to display
 *   - initialData: Initial metadata values
 *   - onSave: Callback function that receives updated metadata
 * 
 * @example
 * <MetadataDialog
 *   isOpen={open}
 *   onClose={handleClose}
 *   fields={[{ name: 'title', title: 'Title', required: true }]}
 *   initialData={{ title: 'Current Title' }}
 *   onSave={(data) => handleSave(data)}
 * />
 */

export const MetadataDialog = ({
  isOpen,
  onClose,
  fields,
  initialData,
  onSave
}: MetadataDialogProps) => {
  // Local state management
  const [formData, setFormData] = useState<Partial<MetadataImage>>({})
  const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({})

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData)
      // Initialize validation status for required fields
      const initialValidation = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: Boolean(initialData[field.name as keyof MetadataImage])
      }), {})
      setValidationStatus(initialValidation)
    }
  }, [isOpen, initialData, fields])

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    setValidationStatus(prev => ({
      ...prev,
      [fieldName]: Boolean(value.trim())
    }))
  }

  const handleSubmit = () => {
    if (Object.values(validationStatus).every(Boolean)) {
      onSave(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog
      header="Edit image metadata"
      id="dialog-image-defaults"
      onClose={onClose}
      zOffset={1000}
      width={2}
    >
      <Card padding={5}>
        <Stack space={3}>
          {fields.map((field: Field) => (
            <Stack space={2} key={field.name}>
              <Label>{field.title}</Label>
              <TextInput
                value={(formData[field.name as keyof MetadataImage] as string) || ''}
                onChange={(event) => handleInputChange(field.name, event.currentTarget.value)}
                placeholder={`Enter ${field.title.toLowerCase()}`}
              />
              {field.required && !validationStatus[field.name] && (
                <Text size={1} style={{ color: 'var(--card-critical-fg)' }}>
                  {field.title} is required
                </Text>
              )}
            </Stack>
          ))}

          <Button
            mode="default"
            tone="primary"
            onClick={handleSubmit}
            text="Save metadata"
            disabled={!Object.values(validationStatus).every(Boolean)}
          />
        </Stack>
      </Card>
    </Dialog>
  )
}