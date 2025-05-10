import {
  Dialog,
  Card,
  Stack,
  Text,
  Flex,
  Button
} from '@sanity/ui'
import { DecorativeDialogProps } from '../../types'

/**
 * Dialog component for confirming decorative image status.
 * When confirmed, removes title and alt text from the image.
 * 
 * @param props Object containing:
 *   - isOpen: Boolean to control dialog visibility
 *   - onClose: Callback function to handle dialog close
 *   - onConfirm: Callback function that receives boolean confirmation status
 * 
 * @example
 * <DecorativeDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={(confirmed) => handleDecorativeMode(confirmed)}
 * />
 */

export const DecorativeDialog = ({
  isOpen,
  onClose,
  onConfirm
}: DecorativeDialogProps) => {
  if (!isOpen) return null

  return (
    <Dialog
      header="Confirm Decorative Image"
      id="dialog-decorative-confirm"
      onClose={onClose}
      zOffset={1001}
      width={1}
    >
      <Card padding={4}>
        <Stack space={4}>
          <Text>
            Making this image decorative will clear its title and alt text if you publish the changes. 
            Do you want to continue?
          </Text>
          <Flex gap={2} justify="flex-end">
            <Button
              mode="ghost"
              text="Cancel"
              onClick={() => onConfirm(false)}
            />
            <Button
              tone="primary"
              text="Continue"
              onClick={() => onConfirm(true)}
            />
          </Flex>
        </Stack>
      </Card>
    </Dialog>
  )
}