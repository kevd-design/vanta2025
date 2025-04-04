

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