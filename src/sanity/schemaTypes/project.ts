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
            type: 'image',
            title: 'Project Image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'projectGallery',
            type: 'array',
            title: 'Project Gallery',
            of: [{ type: 'image' }],
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