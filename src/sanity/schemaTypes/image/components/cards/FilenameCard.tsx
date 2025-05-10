import { Button, Card, Stack, Text, Flex } from '@sanity/ui'
import { FilenameCardProps } from '../../types'

/**
 * Card component for displaying and editing image filenames.
 * Shows current filename and provides editing capability.
 * 
 * @param props Object containing:
 *   - sanityImage: Current image metadata
 *   - imageId: Sanity image asset reference ID
 *   - onOpen: Handler for opening filename dialog
 * 
 * @example
 * <FilenameCard
 *   sanityImage={imageData}
 *   imageId="image-123"
 *   onOpen={() => setFilenameDialogOpen(true)}
 * />
 */
export const FilenameCard = ({
  sanityImage,
  imageId,
  onOpen
}: FilenameCardProps) => {
  return (
    <Card padding={3} radius={2} shadow={1} tone="default">
      <Stack space={4} style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Stack space={3}>
          <Text weight="medium" size={2}>
            Filename
          </Text>
          <Card padding={3} tone="transparent" border radius={2}>
            <Text size={1} muted style={{ lineHeight: '1.5' }}>
              Unique, descriptive filename for SEO and media library organization.
            </Text>
          </Card>
        </Stack>

        {/* Content */}
        <Flex direction="column" flex={1} justify="space-between">
          {sanityImage && (
            <Stack space={4}>
              <Stack space={2}>
                <Text size={1} weight="medium">Current filename</Text>
                <Text muted>{sanityImage?.originalFilename || '—'}</Text>
              </Stack>
            </Stack>
          )}

          {/* Button */}
          <Button
            mode="ghost"
            onClick={onOpen}
            disabled={!imageId}
            text="Edit filename"
            style={{ width: '100%' }}
          />
        </Flex>
      </Stack>
    </Card>
  )
}