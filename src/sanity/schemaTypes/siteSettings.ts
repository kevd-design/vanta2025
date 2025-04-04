import callToAction from "./callToAction";

const siteSettings = {
    name: 'siteSettingsSingleton',
    title: 'Site Settings',
    type: 'document',
    preview: {
        prepare() {
            return {
                title: 'Site Settings',
            }
        }
    },
    groups: [
        {
            title: 'Site-Wide',
            name: 'siteWideSet',            
        },
        {
            name: 'rootPgSet', 
            title: 'Home Page Settings',          
        },
        {
            name: 'projectsPgSet', 
            title: 'Project Page Settings',           
        },
        {
            name: 'aboutPgSet', 
            title: 'About Page Settings',            
        },
        {
            name: 'reviewPgSet', 
            title: 'Review Page Settings',            
        },
        {
            name: 'contactPgSet', 
            title: 'Contact Page Settings',            
        },
    ],
    
    fieldsets: [

        {
            name: 'navigationLabels',
            title: 'Navigation Labels',
            options: { collapsible: true, collapsed: true },
            description: `The navigation labels are the text that appears in the navigation bar of the website. These labels are used to identify the different sections of the website and help users navigate through the site. `,
        },
        {
            name: 'footer',
            title: 'Footer',
            options: { collapsible: true, collapsed: true },
            description: `The footer is the bottom section of a webpage, typically containing copyright information, links to privacy policies, terms of service, and other important site-wide information. `,
        },
        {
            name: 'siteMetaData',
            title: 'Site MetaData',
            options: { collapsible: true, collapsed: true },
            description: 'Metadata for the site. This is used for SEO and social media sharing.',
        },
        {
            name: 'heroSection',
            title: 'Hero Section',
            options: { collapsible: true, collapsed: true },
            description: `A website hero section is the prominent, eye-catching area at the top of a webpage, designed to grab the user's attention and make a strong first impression, often featuring a hero image, headline, and a call to action. `,
        },
        {
            name: 'projectSection',
            title: 'Project Section',
            options: { collapsible: true, collapsed: true },
        },
        {
            name: 'servicesSection',
            title: 'Services Section',
            options: { collapsible: true, collapsed: true },
        },
        {
            name: 'reviewSection',
            title: 'Review Section',
            options: { collapsible: true, collapsed: true },
        }

    ],
    fields: [
    // Site-Wide Settings
        // Navigation Labels
        {
            name: 'homePageNavLabel',
            title: 'Home Page Navigation Label',
            type: 'string',
            fieldset: 'navigationLabels',
            group: 'siteWideSet',
        },
        {
            name: 'projectsPageNavLabel',
            title: 'Projects Page Navigation Label',
            type: 'string',
            fieldset: 'navigationLabels',
            group: 'siteWideSet',
        },
        {
            name: 'aboutPageNavLabel',
            title: 'About Page Navigation Label',
            type: 'string',
            fieldset: 'navigationLabels',
            group: 'siteWideSet',
        },
        {
            name: 'reviewsPageNavLabel',
            title: 'Reviews Page Navigation Label',
            type: 'string',
            fieldset: 'navigationLabels',
            group: 'siteWideSet',
        },
        {
            name: 'contactPageNavLabel',
            title: 'Contact Page Navigation Label',
            type: 'string',
            fieldset: 'navigationLabels',
            group: 'siteWideSet',
        },

        //Footer
        {
            name: 'displayCopyright',
            title: 'Display Copyright',
            type: 'boolean',
            fieldset: 'footer',
            group: 'siteWideSet',
            description: 'Decides whether to show the copyright in the footer or not.',
        },
        {
            name: 'textBeforeCopyright',
            title: 'Text Before Copyright',
            type: 'string',
            fieldset: 'footer',
            group: 'siteWideSet',
            description: 'Text before the copyright in the footer.',
        },
        {
            name: 'copyrightText',
            title: 'Copyright Text',
            type: 'string',
            fieldset: 'footer',
            group: 'siteWideSet',
            description: 'The text denoting this is a copyrighted site. Appears before the year.',

        },
        {
            name: 'copyrightYear',
            title: 'Toggle Copyright Year',
            type: 'boolean',
            fieldset: 'footer',
            group: 'siteWideSet',
            description: 'Decides whether to show the copyright year or not.',
        },
        {
            name: 'textAfterCopyright',
            title: 'Text After Copyright',
            type: 'string',
            fieldset: 'footer',
            group: 'siteWideSet',
            description: 'Text after the copyright in the footer.',
        },
        // Site Meta Data
        {
            name: 'Sitetitle',
            title: 'Site Title',
            type: 'string',
            group: 'siteWideSet',
            fieldset: 'siteMetaData',
            description: 'The title of the site (Shows in the web browser tab when the website is open).',
          },
          {
            name: 'description',
            title: 'Site Description',
            type: 'text',
            group: 'siteWideSet',
            fieldset: 'siteMetaData',
            description: 'The description of the site (shows on Google).',
          },
        // Home Page Settings
          // Hero Section
          {
            name: 'heroHeadline',
            title: 'Hero Headline',
            type: 'string',
            group: 'rootPgSet',
            fieldset: 'heroSection',
            description: `The headline that appears in the hero section of the home page. This is the main text that grabs the user's attention and conveys the primary message of the website.`,
          },
          {
            name: 'heroImage',
            title: 'Hero Image (Home Page)',
            type: 'image',
            options: {
                hotspot: true,
            },
            group:'rootPgSet', 
            fieldset:'heroSection', 
            description:'The background image.'
          },

          {
            name: 'CTA',
            title: 'Call to Action',
            type: 'object',
            group: 'rootPgSet',
            fieldset: 'heroSection',
            fields: callToAction.fields,
    
        }
          
          


        ]
}

export default siteSettings;