import type { Rule } from 'sanity';

const project = {
    name: 'project',
    type: 'document',
    title: 'Projects',
    fields: [
        {
            name: 'projectName',            
            type: 'string'
        },
        { 
            name: 'projectSlug',
            type: 'slug',
            title: 'Project Slug',
            description: 'A slug is a URL-friendly version of the project name. It will be used in the URL for this project. It should be unique and not contain spaces or special characters.',
            options: {
                source: 'projectName',
                maxLength: 96,
                slugify: (input: string) =>
                    input
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-') // Replace spaces and punctuation with hyphens
                        .replace(/^-+|-+$/g, '') // Remove leading or trailing hyphens
                        .slice(0, 200),
            },
            validation: (Rule: Rule) => Rule.required().error('Please enter a slug.'),
        },
        
        {
            name: 'projectDescription',
            type: 'text',
            title: 'Project Description',
            description: 'A short description of the project.',
        },
        {
            name: 'projectImage',
            type: 'imageWithMetadata',
            title: 'Project Image',
            description: 'High-quality image that represents the project.',

            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
            },
        },
        {
            name: 'projectGallery',
            type: 'array',
            title: 'Project Gallery',
            of: [{ type: 'imageWithMetadata',
                            options: {
                                hotspot: true,
                                metadata: ['blurhash', 'lqip', 'palette'],
                                requiredFields: ['title', 'altText'],
                            },
            }],
        },
        { 
            name: 'projectNeighbourhood',
            type: 'reference',
            title: 'Project Neighbourhood',
            to: [{ type: 'neighbourhood' }],

        }

    ]

}

export default project