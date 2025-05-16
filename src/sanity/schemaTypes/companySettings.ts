import type { Rule } from 'sanity';

const companySettings = {
  name: 'companySettingsSingleton',
  title: 'Company Settings',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Company Settings',
      };
    },
  },
  fieldsets: [
    {
      name: 'logos',
      title: 'Logos',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'about',
      title: 'About',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    {
      name: 'logoForLightBG',
      title: 'Logo for Light Background',
      type: 'imageWithMetadata',
      fieldset: 'logos',
      options: {
        hotspot: false,
        metadata: ['blurhash', 'lqip', 'palette'],
        requiredFields: ['title', 'altText'],
      },
      validation: (Rule: Rule) => Rule.required().error('A logo for light backgrounds is required')
    },
    {
      name: 'logoForDarkBG',
      title: 'Logo for Dark Background',
      type: 'imageWithMetadata',
      fieldset: 'logos',
      options: {
        hotspot: false,
        metadata: ['blurhash', 'lqip', 'palette'],
        requiredFields: ['title', 'altText'],
      },
      validation: (Rule: Rule) => Rule.required().error('A logo for dark backgrounds is required')
      
    },
  
    {
      name: 'slogan',
      title: 'Company Slogan',
      type: 'string',
      description: 'The company slogan that appears under the logo',
      fieldset: 'about',
    },

    {
      name: 'aboutHistory',
      title: 'History of the Company',
      type: 'text',
      description: 'A short history of the company.',
      fieldset: 'about',
    },
    {
      name: 'aboutMission',
      title: 'Company Mission',
      type: 'text',
      description: 'A short description of the company mission.',
      fieldset: 'about',
    },
    { 
      name: 'aboutFounder',
      title: 'About the Founder',
      type: 'text',
      description: 'A short description of the founder.',
      fieldset: 'about',

    },

    {
      name: 'founderImage',
      title: 'Founder Image',
      type: 'imageWithMetadata',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
        requiredFields: ['title', 'altText'],
      },
      description: 'An image of the founder.',
      fieldset: 'about',
    },
    { 
      name: 'aboutTeam',
      title: 'About the Team',
      type: 'text',
      description: 'A short description of the team.',
      fieldset: 'about',
    },
    {
      name: 'teamImage',
      title: 'Team Image',
      type: 'imageWithMetadata',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
        requiredFields: ['title', 'altText'],
      },
      description: 'An image of the team.',
      fieldset: 'about',
    }
  ],
};

export default companySettings;