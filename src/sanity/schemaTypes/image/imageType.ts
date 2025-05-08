// schemas/image/imageType.ts

import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import ImageInput from './components/ImageInput'

// redeclare IntrinsicDefinitions for ImageOptions and add `requiredFields` to it
declare module 'sanity' {
  export interface ImageOptions {
    requiredFields?: string[]
  }
}

/** ImageType with Metadata Input
 *
 * This is a custom image type that allows you to add metadata to the image asset directly.
 * These values follow the same logic as the media browser plugin {@link https://www.sanity.io/plugins/sanity-plugin-media}
 *
 * Since the metadata is added to the image asset, it is available in the frontend via the Sanity CDN.
 *
 * ## Usage
 *
 * ```ts
 *   defineField({
 *      type: 'imageWithMetadata',
 *      name: 'metaImage',
 *      title: 'Meta Image',
 *    }),
 * ```
 *
 * ## Required Fields
 *
 * You can set required fields in the options of the image type.
 *
 * ```ts
 *     requiredFields: ['title', 'altText'],
 * ```
 *
 * ## Validation
 *
 * The validation checks if the required fields are set in the image asset.
 * Redefining required fields on the field level will override the options.requiredFields in the type schema definition.
 *
 * ```ts
 *     defineField({
 *       type: 'imageWithMetadata',
 *       name: 'metaImage',
 *       title: 'Meta Image',
 *       options: {
 *         requiredFields: ['title', 'altText', 'description'],
 *       },
 *     }),
 * ```
 *
 */
export const imageType = defineType({
  name: 'imageWithMetadata',
  type: 'image',
  title: 'Image',
  description: `Please add the metadata you want to use in the frontend.`,
  icon: ImageIcon,
  options: {
    hotspot: true,
    metadata: ['blurhash', 'lqip', 'palette'],
    requiredFields: ['title', 'altText'],
  },
  components: {
    input: ImageInput,
  },

  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      const client = context.getClient({ apiVersion: '2021-03-25' })

      /** Stop validation when no value is set
       * If you want to set the image as `required`,
       * you should change `true` to "Image is required"
       * or another error message
       */
      if (!value) return true

      /** Get global metadata for set image asset */
      const imageMeta = await client.fetch(
        '*[_id == $id][0]{description, altText, title}',
        { id: value?.asset?._ref }
      )

      /** Check if all required fields are set */
      const requiredFields = context.type?.options?.requiredFields ?? ['title', 'altText']

      const invalidFields = requiredFields.filter((field: string) => {
        return imageMeta[field] === null
      })
      if (invalidFields.length > 0) {
        const message = `Please add a ${invalidFields.join(
          ', '
        )} value to the image!`
        return { valid: false, message }
      }
      return true
    }),
  fields: [
    // we use this to cause revalidation of document when the image is changed
    // A listener would also be an option, but more complex
    defineField({
      type: 'boolean',
      name: 'changed',
      hidden: true,
    }),
  ],
})