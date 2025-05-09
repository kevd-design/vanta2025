import {
  Dialog,
  Card,
  Stack,
  Text,
  Flex,
  Button
} from '@sanity/ui'
import { DecorativeDialogProps } from '../../types'

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