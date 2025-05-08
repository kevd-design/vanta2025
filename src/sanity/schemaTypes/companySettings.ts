

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
      type: 'image',
      fieldset: 'logos',
      
    },
    {
      name: 'logoForDarkBG',
      title: 'Logo for Dark Background',
      type: 'image',
      fieldset: 'logos',
      
    },
    {
      name: 'testImage',
      title: 'Test Image',
      type: 'imageWithMetadata',
      fieldset: 'logos',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
        requiredFields: ['title', 'altText'],
      },

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
      type: 'image',
      options: {
        hotspot: true,
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
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'An image of the team.',
      fieldset: 'about',
    }
  ],
};

export default companySettings;