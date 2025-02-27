import type { Rule } from 'sanity';

const required = {
    validation: (rule: Rule) => rule.required()
}

const allCollapsed = {
        collapsible: true,
        collapsed: true
}

const descriptions = {
    default: `Name for the page used as a header, in navigation and in the URL unless overidden by the below settings.`,
    short: `Optionally, provide a shorter name for the navigation title for this page.`,
    slug: `Optionally, provide custom text for the URL (Also known as the slug for this page), this will be used instead of the title.`,
}

const pages = {
    name: 'pageNamesSingleton',
    title: 'Pages',
    type: 'document',
    preview: {
        prepare() {
            return {
                title: 'Website Page Names'
            }
        }
    },

    fieldsets: [
        {
            name: 'rootPgSet', 
            title: 'Home Page Settings',
            options: {
                collapsible: false,
                collapsed: true
            }
        },
        {
            name: 'projectsPgSet', 
            title: 'Project Page Settings',
            options: {
                ...allCollapsed
            } 
        },
        {
            name: 'aboutPgSet', 
            title: 'About Page Settings',
            options: {
                ...allCollapsed
            } 
        },
        {
            name: 'reviewPgSet', 
            title: 'Review Page Settings',
            options: {
                ...allCollapsed
            } 
        },
        {
            name: 'contactPgSet', 
            title: 'Contact Page Settings',
            options: {
                ...allCollapsed
            } 
        },
    ],

    fields: [
        // Homepage
       {name: 'rootPgName',
        title: 'Home Page Name',
        type: 'string',
        description: descriptions.default,
        fieldset: 'rootPgSet',
        ...required
       },
       {name: 'rootPgNameShort',
        title: 'Shortened Home Page Name',
        type: 'string',
        description: descriptions.short,
        fieldset: 'rootPgSet',
       },
       {name: 'rootPgNameSlug',
        title: 'URL Name for Home Page',
        type: 'string',
        description: descriptions.slug,
        fieldset: 'rootPgSet',
       },

       // Projects page
       {name: 'projectsPgName',
        title: 'Project Page Name',
        type: 'string',
        description: descriptions.default,
        fieldset: 'projectsPgSet',
        ...required
       },
       {name: 'projectsPgNameShort',
        title: 'Shortened Project Page Name',
        type: 'string',
        description: descriptions.short,
        fieldset: 'projectsPgSet',
       },
       {name: 'projectsPgNameSlug',
        title: 'URL Name for Project Page',
        type: 'string',
        description: descriptions.slug,
        fieldset: 'projectsPgSet',
       },

       // About page
       {name: 'aboutPgName',
        title: 'About Page Name',
        type: 'string',
        description: descriptions.default,
        fieldset: 'aboutPgSet',
        ...required
       },

       {name: 'aboutPgNameShort',
        title: 'Shortened About Page Name',
        type: 'string',
        description: descriptions.short,
        fieldset: 'aboutPgSet',
       },
       {name: 'aboutPgNameSlug',
        title: 'URL Name for About Page',
        type: 'string',
        description: descriptions.slug,
        fieldset: 'aboutPgSet',
       },

       // Review page

       {name: 'reviewPgName',
        title: 'Review Page Name',
        type: 'string',
        description: descriptions.default,
        fieldset: 'reviewPgSet',
        ...required
       },

       {name: 'reviewPgShort',
        title: 'Shortened Review Page Name',
        type: 'string',
        description: descriptions.short,
        fieldset: 'reviewPgSet',
       },
       {name: 'reviewPgSlug',
        title: 'URL Name for Review Page',
        type: 'string',
        description: descriptions.slug,
        fieldset: 'reviewPgSet',
       },

       // Contact page

       {name: 'contactPgName',
        title: 'Contact Page Name',
        type: 'string',
        description: descriptions.default,
        fieldset: 'contactPgSet',
        ...required
       },
       {name: 'contactPgNameShort',
        title: 'Shortened Contact Page Name',
        type: 'string',
        description: descriptions.short,
        fieldset: 'contactPgSet',
       },
       {name: 'contactPgNameSlug',
        title: 'URL Name for Contact Page',
        type: 'string',
        description: descriptions.slug,
        fieldset: 'contactPgSet',
       },
    ],
   
}

export default pages