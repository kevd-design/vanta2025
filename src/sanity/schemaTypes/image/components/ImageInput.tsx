import {
  Button,
  Card,
  Flex,
  Stack,
  useToast,
  Text,
  Grid

} from '@sanity/ui'
import { ComponentType, useCallback, useEffect, useState } from 'react'
import { Subscription } from 'rxjs'
import {
  pathToString,
  useClient,
  useFormValue,
  PatchEvent,
  set
} from 'sanity'


import { 
  ImageInputProps, 
  DialogStates, 
  MetadataImage
} from '../types'
import { handleGlobalMetadataConfirm } from '../utils/handleGlobalMetadataConfirm'
import { sleep } from '../utils/sleep'

import { FilenameDialog } from './dialogs/FilenameDialog'
import { MetadataDialog } from './dialogs/MetadataDialog'
import { DecorativeDialog } from './dialogs/DecorativeDialog'

const ImageInput: ComponentType<ImageInputProps> = (props: ImageInputProps)  => {
  /*
   * Variables and Definitions used in the component
   */

  /** Fields to be displayed in the metadata modal */
  const fields = (props.schemaType?.options?.requiredFields ?? []).map((fieldName: string) => ({
    name: fieldName,
    // Convert field name to title case (e.g., "altText" becomes "Alt Text")
    title: fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim(), // Remove any extra spaces
    required: true
  }));
  

  /** # Toast component
   *
   * Use the toast component to display a message to the user.
   * more {@link https://www.sanity.io/ui/docs/component/toast}
   *
   * ## Usage
   *
   * ```ts
   * .then((res) => toast.push({
   *     status: 'error',
   *     title: <TITLE STRING>,
   *     description: <DESCRIPTION STRING>,
   *   })
   * )
   * ```
   */
  const toast = useToast()
  /** Document values via Sanity Hooks */
  const docId = useFormValue(['_id']) as string
  /** image change boolean for each patch to toggle for revalidation on document */
  const changed =
    (useFormValue([pathToString(props.path), 'changed']) as boolean) ?? false
  /** Image ID from the props */
  const imageId = props.value?.asset?._ref
  /** Sanity client */
  const client = useClient({ apiVersion: '2023-03-25' })

  /*
   * Dialog states & callbacks
   */

  /** Sanity Image Data State
   *
   * Referenced data, fetched from image asset via useEffect and listener (subscription)
   *
   * */
  const [sanityImage, setSanityImage] = useState<MetadataImage | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState<DialogStates['showConfirmDialog']>(false)
  const [originalMetadata, setOriginalMetadata] = useState<MetadataImage | null>(null);
  const [openFilenameDialog, setOpenFilenameDialog] = useState<DialogStates['openFilenameDialog']>(false);
  

  /** Dialog (dialog-image-defaults) */
  const [open, setOpen] = useState<DialogStates['open']>(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleFilenameDialogOpen = useCallback(() => {
    setOpenFilenameDialog(true);
  }, []);

const handleMetadataSave = useCallback((updatedMetadata: Partial<MetadataImage>) => {
  setSanityImage(prev => prev && {
    ...prev,
    ...updatedMetadata,
    _id: prev._id // Ensure _id is preserved
  });

  if (sanityImage) {
    const updatedImage: MetadataImage = {
      ...sanityImage,
      ...updatedMetadata,
      _id: sanityImage._id // Ensure _id is preserved
    };
    
    handleGlobalMetadataConfirm({
      sanityImage: updatedImage,
      toast,
      client,
      onClose,
      docId,
      changed,
      imagePath: pathToString(props.path),
    });
  }
}, [sanityImage, client, docId, changed, props.path, onClose, toast]);
 
const handleFilenameSave = useCallback((newFilename: string) => {
  if (!sanityImage) return;
  
    const updatedImage = {
      ...sanityImage,
      originalFilename: newFilename
    };
    setSanityImage(updatedImage);
    handleGlobalMetadataConfirm({
      sanityImage: updatedImage,
      toast,
      client,
      onClose: () => setOpenFilenameDialog(false),
      docId,
      changed,
      imagePath: pathToString(props.path),
    });
  
}, [sanityImage, client, docId, changed, props.path, toast]);

  const decorative = props.value?.decorative || false;
  
  const { onChange, value } = props;
  const handleDecorativeConfirm = useCallback((confirmed: boolean) => {
  if (confirmed) {
    // Update local state and schema
    setSanityImage(prev => prev && ({
      ...prev,
      altText: '',
      title: ''
    }));
    // Set decorative flag to true
    onChange(PatchEvent.from([
      set({
        ...value,
        decorative: true
      })
    ]));
  } else {
    // Reset decorative checkbox to false
    onChange(PatchEvent.from([
      set({
        ...value,
        decorative: false
      })
    ]));
  }
  setShowConfirmDialog(false);
}, [onChange, value]);

  /*
   * Fetching the global image data
   */
  useEffect(() => {
    /** Initialising the subscription
     *
     * we need to initialise the subscription so we can then listen for changes
     */
    let subscription: Subscription

    const query = `*[_type == "sanity.imageAsset" && _id == $imageId ][0]{
      _id,
      altText,
      title, 
      description,
      originalFilename,
      extension
    }`
    const params = { imageId: imageId }

    const fetchReference = async (listening = false) => {
      /** Debouncing the listener
       */
      if (listening) {
        await sleep(1500)
      }

      /** Fetching the data */
      await client
        .fetch(query, params)
        .then((res) => {
          setSanityImage(res)
          
          // Store original metadata when first fetched
          if (!originalMetadata) {
            setOriginalMetadata(res);
          }
        })
        .catch((err) => {
          console.error(err.message)
        })
    }

    /** since we store our referenced data in a state we need to make sure, we also listen to changes */
    const listen = () => {
      
      subscription = client
        .listen(query, params, { visibility: 'query' })
        .subscribe(() => fetchReference(true))
    }

    /** we only want to run the fetchReference function if we have a imageId (from the context) */
    if (imageId) {
      fetchReference().then(listen);
    } else {
      setSanityImage(null);
    }

    /** and then we need to cleanup after ourselves, so we don't get any memory leaks */
    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId, client])

    // Watches for changes to props.value.decorative
    //
  useEffect(() => {
    const isDecorative = props.value?.decorative;
    if (isDecorative && (sanityImage?.altText || sanityImage?.title)) {
      setShowConfirmDialog(true);
    }
    
  }, [props.value?.decorative, sanityImage]);

  // Watches for changes to props.value.decorative and originalMetadata
  // Restores original metadata when decorative is turned off
  // This is to ensure that the user can revert back to the original metadata if they change their mind
  // about making the image decorative.
  useEffect(() => {
  if (!props.value?.decorative && originalMetadata) {
    // Restore original metadata when decorative is turned off
    setSanityImage(prev => prev && ({
      ...prev,
      altText: originalMetadata.altText,
      title: originalMetadata.title
    }));
  }
}, [props.value?.decorative, originalMetadata]);




  return (
    <div>
      {/* * * DEFAULT IMAGE INPUT * * *
       */}
      {props.renderDefault(props)}

      {/* * * METADATA AND FILENAME CARDS * * *
       * * * * * * * * * * * * * * *
       */}



<Grid columns={2} gap={4} marginTop={4}>
  {/* Metadata Column */}
  <Card padding={3} radius={2} shadow={1} tone="default">
    <Stack space={4} style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Stack space={3}>
        <Text weight="medium" size={2}>
          Metadata
        </Text>
        <Card padding={3} tone="transparent" border radius={2}>
          <Text size={1} muted style={{ lineHeight: '1.5' }}>
            Clear, descriptive text that helps users understand the image content and enhances SEO.
          </Text>
        </Card>
      </Stack>

      {/* Content */}
      <Flex direction="column" flex={1} justify="space-between">
        <Stack space={4}>
          {!decorative ? (
            sanityImage && (
              <Stack space={4}>
                <Stack space={2}>
                  <Text size={1} weight="medium">Title</Text>
                  <Text muted>{sanityImage?.title || '—'}</Text>
                </Stack>
                <Stack space={2}>
                  <Text size={1} weight="medium">Alt Text</Text>
                  <Text muted>{sanityImage?.altText || '—'}</Text>
                </Stack>
              </Stack>
            )
          ) : (
            <Text size={1} muted>
              Metadata hidden - image is decorative
            </Text>
          )}
        </Stack>

        {/* Button */}
        {!decorative && (
          <Button
            mode="ghost"
            onClick={onOpen}
            disabled={!imageId}
            text="Edit metadata"
            style={{ width: '100%' }}
          />
        )}
      </Flex>
    </Stack>
  </Card>

  {/* Filename Column */}
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
          onClick={handleFilenameDialogOpen}
          disabled={!imageId}
          text="Edit filename"
          style={{ width: '100%' }}
        />
      </Flex>
    </Stack>
  </Card>
</Grid>



{/* * * FILENAME EDIT MODAL * * */}
      <FilenameDialog
        isOpen={openFilenameDialog}
        onClose={() => setOpenFilenameDialog(false)}
        initialFilename={sanityImage?.originalFilename ?? ''}
        onSave={handleFilenameSave}
      />
    

      {/* * * DECORATIVE DIALOG * *
       */}
       {showConfirmDialog && (
        <DecorativeDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleDecorativeConfirm}
        />
  )}
      {open && (
        <MetadataDialog
          isOpen={open}
          onClose={onClose}
          fields={fields}
          initialData={sanityImage}
          onSave={handleMetadataSave}
        />
      )}
    </div>
  )
}

export default ImageInput