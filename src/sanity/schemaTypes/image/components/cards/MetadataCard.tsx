import { Button, Card, Stack, Text, Flex } from '@sanity/ui'
import { MetadataCardProps } from '../../types'

/**
 * Card component for displaying and editing image metadata.
 * Shows title and alt text, with option to edit if image is not decorative.
 * 
 * @param props Object containing:
 *   - sanityImage: Current image metadata
 *   - isDecorative: Whether the image is decorative
 *   - imageId: Sanity image asset reference ID
 *   - onOpen: Handler for opening metadata dialog
 * 
 * @example
 * <MetadataCard
 *   sanityImage={imageData}
 *   isDecorative={false}
 *   imageId="image-123"
 *   onOpen={() => setDialogOpen(true)}
 * />
 */

export const MetadataCard = ({ 
  sanityImage, 
  isDecorative, 
  imageId, 
  onOpen 
}: MetadataCardProps) => {
  return (
    <Card padding={3} radius={2} shadow={1} tone="default" height="fill">
      <Flex direction="column" style={{ height: '100%' }}>
        {/* Header */}
        <Stack space={3} marginBottom={4}>
          <Text weight="medium" size={2}>
            Metadata
          </Text>
          <Card padding={3} tone="transparent" border radius={2}>
            <Text size={1} muted style={{ lineHeight: '1.5' }}>
              Clear, descriptive text that helps users understand the image content and enhances SEO.
            </Text>
          </Card>
        </Stack>

        {/* Content - Grows to fill available space */}
        <Flex direction="column" flex={1} justify="flex-start">
          <Stack space={4} flex={1}>
            {!isDecorative ? (
              sanityImage && (
                <Stack space={4}>
                  <Stack space={2}>
                    <Text size={1} weight="medium">Title</Text>
                    <Text muted style={{ wordBreak: 'break-word' }}>
                      {sanityImage?.title || '—'}
                    </Text>
                  </Stack>
                  <Stack space={2}>
                    <Text size={1} weight="medium">Alt Text</Text>
                    <Text muted style={{ wordBreak: 'break-word' }}>
                      {sanityImage?.altText || '—'}
                    </Text>
                  </Stack>
                </Stack>
              )
            ) : (
              <Text size={1} muted>
                Metadata hidden - image is decorative
              </Text>
            )}
          </Stack>
        </Flex>

        {/* Button - Always at bottom */}
        {!isDecorative && (
          <Button
            mode="ghost"
            onClick={onOpen}
            disabled={!imageId}
            text="Edit metadata"
            style={{ width: '100%', marginTop: '16px' }}
          />
        )}
      </Flex>
    </Card>
  )
}