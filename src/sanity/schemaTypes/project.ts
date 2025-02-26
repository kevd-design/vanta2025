

const project = {
    name: 'project',
    type: 'document',
    fields: [
        {
            name: 'projectName',            
            type: 'string'
        },
        {
           name: 'isPublished',
           type: 'boolean',
           title: 'Published',
           description: 'Set to published when you want this project to be visible on the website.'
        },

    ]

}

export default project