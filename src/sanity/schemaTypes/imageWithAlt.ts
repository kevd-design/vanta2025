// schemas/objects/imageWithAlt.ts
import type { Rule } from 'sanity'
import { defineType } from 'sanity'

export default defineType({
    name: 'imageWithAlt',
    type: 'object',
    title: 'Image with Alt Text',
    fields: [
        {
            name: 'image',
            type: 'image',
            title: 'Image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                    description: 'Important for SEO and accessibility.',
                    validation: (Rule: Rule) =>
                        Rule.required().error('Alternative text is required'),
                },
            ],
            validation: (Rule: Rule) =>
                Rule.required().error('Please upload an image.'),
        },
    ],
    preview: {
        select: {
            media: 'image',
            title: 'image.alt',
        },
        prepare({ media, title }) {
            return {
                title: title || 'No alt text yet',
                media,
            }
        },
    },
})