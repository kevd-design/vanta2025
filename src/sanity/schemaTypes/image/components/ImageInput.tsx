import {
  Button,
  Card,
  Dialog,
  Flex,
  Label,
  Stack,
  TextInput,
  useToast,
} from '@sanity/ui'
import { ComponentType, useCallback, useEffect, useState } from 'react'
import { Subscription } from 'rxjs'
import {
  ImageValue,
  ObjectInputProps,
  ObjectSchemaType,
  pathToString,
  useClient,
  useFormValue,
} from 'sanity'

import Metadata from './Metadata'
import { MetadataImage } from '../types'
import { handleGlobalMetadataConfirm } from '../utils/handleGlobalMetadataConfirm'
import { sleep } from '../utils/sleep'

const ImageInput: ComponentType<
  ObjectInputProps<ImageValue, ObjectSchemaType>
> = (props: ObjectInputProps<ImageValue>) => {
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
  console.log('fields', fields)

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

  /** get object for error state from required values in `fields` array
   * @see {@link fields}
   */
  const fieldsToValidate = fields.reduce((acc: Record<string, boolean>, field: { name: string; required?: boolean }) => {
    if (field.required) {
      return { ...acc, [field.name]: false }
    }
    return acc
  }, {})

  /** Error state used for disabling buttons in case of missing data */
  const [validationStatus, setValidationStatus] = useState(fieldsToValidate)

  /** Dialog (dialog-image-defaults) */
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])

  /** Handle Change from Inputs in the metadata modal
   *
   * @param {string} event is the value of the input
   * @param {string} field is the input name the change is made in (corresponds with the field name on the sanity.imageAsset type)
   */
  const handleChange = useCallback(
    (event: string, field: string) => {
      /* unset value */
      setSanityImage((prevSanityImage) => {
        if (!prevSanityImage) return null
        return {
          ...prevSanityImage,
          [field]: event || ''
        } as MetadataImage
      })

      const isFieldToValidate = fieldsToValidate[field] !== undefined
      if (isFieldToValidate) {
        setValidationStatus((prevValidationStatus: Record<string, boolean>) => ({
          ...prevValidationStatus,
          [field]: event.trim() !== '',
        }))
      }
    },
    [fieldsToValidate]
  )

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
          // check if all required fields are filled by checking if validationStatus fields have values in res
          const resValidationStatus = Object.entries(res).reduce(
            (acc, [key, value]) => {
              if (value && fieldsToValidate[key] !== undefined) {
                return { ...acc, [key]: true }
              }
              if (!value && fieldsToValidate[key] !== undefined) {
                return { ...acc, [key]: false }
              }
              return acc
            },
            {}
          )
          setValidationStatus(resValidationStatus)
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

  /** Input fields based on the `fields` array */
interface Field {
  name: string
  title: string
  required?: boolean
}

const inputs = fields.map((field: Field) => {
  return (
    <Card paddingBottom={4} key={field.name}>
      <label>
        <Stack space={3}>
          <Label muted size={1}>
            {field.title}
          </Label>
          <TextInput
            id={`image-${field.name}`} // Add unique id for each input
            fontSize={2}
            onChange={(event) =>
              handleChange(event.currentTarget.value, field.name)
            }
            placeholder={`Enter ${field.title.toLowerCase()}`}
            value={sanityImage ? (sanityImage[field.name] as string) : ''}
            required={field.required}
          />
        </Stack>
      </label>
    </Card>
  )
});

  console.log('inputs', inputs)

  return (
    <div>
      {/* * * DEFAULT IMAGE INPUT * * *
       */}
      {props.renderDefault(props)}

      {/* * * METADATA PREVIEW DISPLAYED UNDERNEATH INPUT * * *
       */}
      <Stack paddingY={3}>
        {sanityImage && (
          <Stack space={3} paddingBottom={2}>
            <Metadata key="title" title="Title" value={sanityImage?.title as string} />
            <Metadata key="altText" title="Alt Text" value={sanityImage?.altText as string} />
            {/* * * Disabled description as it's not necessary for SEO * * *
       */}
            {/* <Metadata key="description" title="Description" value={sanityImage?.description as string} /> */}
          </Stack>
        )}
        {/* * * BUTTON TO OPEN EDIT MODAL * * *
         */}
        <Flex paddingY={3}>
          <Button
            mode="ghost"
            onClick={onOpen}
            disabled={imageId ? false : true}
            text="Edit metadata"
          />
        </Flex>
      </Stack>
      {/* * * METADATA INPUT MODAL * *
       */}
      {open && (
        <Dialog
          header="Edit image metadata"
          id="dialog-image-defaults"
          onClose={onClose}
          zOffset={1000}
          width={2}
        >
          <Card padding={5}>
            <Stack space={3}>
              {/*
               * * * INPUT FIELDS * * *
               */}
              {inputs}

              {/*
               * * * SUBMIT BUTTON * * *
               */}
              <Button
                mode="ghost"
                onClick={() =>
                  sanityImage && handleGlobalMetadataConfirm({
                    sanityImage,
                    toast,
                    client,
                    onClose,
                    docId,
                    changed,
                    imagePath: pathToString(props.path),
                  })
                }
                text="Save global changes"
                disabled={
                  !sanityImage || !Object.values(validationStatus).every((isValid) => isValid)
                }
              />
            </Stack>
          </Card>
        </Dialog>
      )}
    </div>
  )
}

export default ImageInput