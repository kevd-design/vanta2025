import type { Rule } from 'sanity';
import callToAction from "./callToAction";
import { EDITOR_CONFIG } from '@/sanity/lib/editorConfig';

const siteSettings = {
    name: 'siteSettingsSingleton',
    title: 'Site Page Settings',
    type: 'document',
    preview: {
        prepare() {
            return {
                title: 'Site Page Settings',
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
            title: 'Home',
        },
        {
            name: 'projectIndexPgSet',
            title: 'Project Index',
        },
        {
            name: 'projectsPgSet', 
            title: 'Project Page',         
        },
        {
            name: 'aboutPgSet', 
            title: 'About',            
        },
        {
            name: 'reviewPgSet', 
            title: 'Review',            
        },
        {
            name: 'contactPgSet', 
            title: 'Contact',            
        },
    ],
    
    fieldsets: [

        // Site-Wide fieldsets

        {
            name: 'navigation',
            title: 'Navigation',
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

        // Home Page fieldsets
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
            description: `The project section is a part of the website that showcases a project done by the company.`,
        },
        {
            name: 'servicesSection',
            title: 'Services Section',
            options: { collapsible: true, collapsed: true },
            description: `The services section briefly describes the services offered.`,
        },
        {
            name: 'reviewSection',
            title: 'Review Section',
            options: { collapsible: true, collapsed: true },
            description: `The review section shocases a client's review of the company. This is a great way to build trust and credibility with potential customers.`,
        },

 

    ],
    fields: [
    // Site-Wide Settings
        // Navigation Labels
        {
            name: 'homePageNavLabel',
            title: 'Home Page Navigation Label',
            type: 'string',
            fieldset: 'navigation',
            group: 'siteWideSet',
        },
        {
            name: 'projectsPageNavLabel',
            title: 'Projects Page Navigation Label',
            type: 'string',
            fieldset: 'navigation',
            group: 'siteWideSet',
        },
        {
            name: 'aboutPageNavLabel',
            title: 'About Page Navigation Label',
            type: 'string',
            fieldset: 'navigation',
            group: 'siteWideSet',
        },
        {
            name: 'reviewsPageNavLabel',
            title: 'Reviews Page Navigation Label',
            type: 'string',
            fieldset: 'navigation',
            group: 'siteWideSet',
        },
        {
            name: 'contactPageNavLabel',
            title: 'Contact Page Navigation Label',
            type: 'string',
            fieldset: 'navigation',
            group: 'siteWideSet',
        },

        // Mobile Background Image
        {
            name: 'mobileBackgroundImage',
            title: 'Mobile Background Image',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            type: 'imageWithMetadata',
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            fieldset: 'navigation',
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
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group:'rootPgSet', 
            fieldset:'heroSection', 
            description:'The background image.'
        },
        {
            name: 'heroCTA',
            title: 'Hero Call to Action',
            type: 'object',
            group: 'rootPgSet',
            fieldset: 'heroSection',
            fields: callToAction.fields,
        },

        // Project Section


        {
            name: 'projectCTA',
            title: 'Project Section Call to Action',
            type: 'object',
            group: 'rootPgSet',
            fieldset: 'projectSection',
            fields: callToAction.fields,
        },

        // Services Section
        {
            name: 'servicesTitle',
            title: 'Services Title',
            type: 'string',
            group: 'rootPgSet',
            fieldset: 'servicesSection',
            description: `The title that appears in the services section of the home page.`,
        },
        {
            name: 'servicesDescription',
            title: 'Services Description',
            type: 'text',
            group: 'rootPgSet',
            fieldset: 'servicesSection',
            description: `A short description of the services offered by the company.`,
        },
        {
            name: 'backgroundImageServices',
            title: 'Services Background Image',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group:'rootPgSet',
            fieldset:'servicesSection',
            description: 'The background image for the services section.',
        },
        {
            name: 'servicesCTA',
            title: 'Services Call to Action',
            type: 'object',
            group: 'rootPgSet',
            fieldset: 'servicesSection',
            fields: callToAction.fields,
        },

        
        // Review Section
        {
            name: 'reviewerName',
            title: 'Reviewer Name',
            type: 'string',
            group: 'rootPgSet',
            fieldset: 'reviewSection',
            description: `The name of the person who wrote the review.`,
        },

        {
            name: 'reviewText',
            title: 'Review Text',
            type: 'text',
            group: 'rootPgSet',
            fieldset: 'reviewSection',
            description: `The text of the review.`,
        },
        {
            name: 'reviewCTA',
            title: 'Review Call to Action',
            type: 'object',
            group: 'rootPgSet',
            fieldset: 'reviewSection',
            fields: callToAction.fields,
        },

    // Project Index Page Settings
        {
            name: 'projectIndexPageTitle',
            title: 'Project Index Page Title',
            type: 'string',
            group: 'projectIndexPgSet',
            description: `The title that appears above the project index section of the project index page.`,
        },
        {
            name: 'projectIndexPageDescription',
            title: 'Project Index Page Description',
            type: 'text',
            group: 'projectIndexPgSet',
            description: `A short description of the project index page.`,
        },
 
    // Projects Page Settings
        {
            name: 'gallaryTitle',
            title: 'Gallery Title',
            type: 'string',
            group: 'projectsPgSet',
            description: `The title that appears above the project gallery section of the specific project page.`,
        },

    // About Page Settings
        {
            name: 'aboutPageTitle',
            title: 'About Page Title',
            type: 'string',
            group: 'aboutPgSet',
            description: `The title that appears above the about section of the about page.`,
        },
        {
            name: 'aboutPageHeroImage',
            title: 'About Page Hero Image',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group: 'aboutPgSet',
        },
    // Review Page Settings
        {
            name: 'reviewPageTitle',
            title: 'Review Page Title',
            type: 'string',
            group: 'reviewPgSet',
            description: `The title that appears above the review section of the review page.`,
        },
        {
            name: 'reviewPageBackgroundImage',
            title: 'Review Page Background Image',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group: 'reviewPgSet',
            description: 'The background image for the review page.',
        },
        {
            name: 'reviewPageDescriptiveImage',
            title: 'Review Page Descriptive Image',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group: 'reviewPgSet',
            description: 'The image that appears in the  review section of the review page. This image should be relevant to the review and help to convey where the reviews are located.',
        },
        {
            name: 'reviewPageSummary',
            title: 'Location of Reviews Summary',
            type: 'text',
            group: 'reviewPgSet',
            description: `A short description of where the reviews are currently locarted.`,
        },
        {
            name: 'viewReviewsCTA',
            title: 'View Reviews Call to Action',
            type: 'object',
            group: 'reviewPgSet',
            fields: callToAction.fields,
        },
        {
            name: 'submitReviewTitle',
            title: 'Submit Review Title',
            type: 'string',
            group: 'reviewPgSet',
            description: `The title that appears above the submit review section of the review page.`,
        },
        {
            name: 'submitReviewInvitation',
            title: 'Submit Review Invitation',
            type: 'text',
            group: 'reviewPgSet',
            description: `A short invitation to submit a review.`,
        },
        {
            name: 'submitReviewCTA',
            title: 'Submit Review Call to Action',
            type: 'object',
            group: 'reviewPgSet',
            fields: callToAction.fields,
        },
    // Contact Page Settings
        {
            name: 'contactPageTitle',
            title: 'Contact Page Title',
            type: 'string',
            group: 'contactPgSet',
            description: `The title that appears above the contact section of the contact page.`,
        },
        {
            name: 'contactsPagebackgroundImage',
            title: 'Contact Page Background Image',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group: 'contactPgSet',
        },
        {
            name: 'PhoneLabel',
            title: 'Phone Label',
            type: 'string',
            group: 'contactPgSet',
        },
        {
            name: 'PhoneNumber',
            title: 'Phone Number',
            type: 'string',
            group: 'contactPgSet',
            description: `The phone number of the company. This is the number that users can call to get in touch with the company.`,
        },
        {
            name: 'emailLabel',
            title: 'Email Label',
            type: 'string',
            group: 'contactPgSet',
        },
        {
            name: 'emailAddress',
            title: 'Email Address',
            type: 'email',
            validation: (Rule: Rule) => Rule.required().error('Please enter a valid email address.'),
            group: 'contactPgSet',
            
        },
        {
            name: 'socialMediaLabel',
            title: 'Social Media Label',
            type: 'string',
            group: 'contactPgSet',
        },
        {
            name: 'instagramIcon',
            title: 'Instagram Icon',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group: 'contactPgSet',
        },
        {
            name: 'instagramLink',
            title: 'Instagram Link',
            type: 'url',
            group: 'contactPgSet',
            
        },
        {
            name: 'facebookIcon',
            title: 'Facebook Icon',
            type: 'imageWithMetadata',
            readOnly: EDITOR_CONFIG.READ_ONLY_IMAGES,
            
            options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette'],
                requiredFields: ['title', 'altText'],
              },
            group: 'contactPgSet',
            
        },
        {
            name: 'facebookLink',
            title: 'Facebook Link',
            type: 'url',
            group: 'contactPgSet',
            
        }

    ]
}

export default siteSettings;