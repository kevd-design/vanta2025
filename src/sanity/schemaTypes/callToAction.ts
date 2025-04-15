import type { Rule } from 'sanity';

interface CTALinkParent {
    linkType?: 'reference' | 'toPage' | 'externalLink';
  }


// This is the call to action object. It is used to create a call to action button that links to a specific project, a page on the site, or an external link.
const callToAction = {
    name: 'CTA',
    title: 'Call to Action',
    type: 'object',
    description: `You can point users to a specific project or page on your site, or an external link. This is the button that encourages users to take action.`,
    fields: [
        {
            name: 'linkLabel',
            title: 'Link Label',
            type: 'string',
            description: `The text that appears on the call to action button. This is the text that encourages users to take action.`,
            validation: (Rule: Rule) => Rule.required().error('Please enter a label for the link.'),
        },
        {   name: 'linkType',
            title: 'Link Type', 
            type: 'string',
            options: {
                list: [ 
                    {title: `Reference to Project`, value:`reference`},
                    {title: `Reference to Page`, value: `toPage`},
                    {title: `External Link`, value: `externalLink`}
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            validation: (Rule: Rule) => Rule.required().error('Please select a link type.'),
        },
        {
            name: 'reference',
            title: 'Reference to Project',
            type: 'reference',
            to: [{ type: 'project' }],
            hidden: ({ parent, value }: { parent?: CTALinkParent; value?: string}) => !value && parent?.linkType !== 'reference',
            validation: (Rule: Rule) => Rule.custom((field,context) => {
                const doc = context.parent as CTALinkParent;
                
                if (doc?.linkType === 'reference' && !field) {
                    return 'Please select a project.';
                }
                return true;
            })
        },

        {
            name: 'toPage',
            title: 'Reference to Page',
            type: 'string',
            options: {
                list: [
                    {title: `Home`, value:`home`},
                    {title: `Projects`, value:`projects`},
                    {title: `About`, value:`about`},
                    {title: `Reviews`, value:`reviews`},
                    {title: `Contact`, value:`contact`}
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            hidden: ({ parent, value }: { parent?: CTALinkParent; value?: string}) => !value && parent?.linkType !== 'toPage',
            validation: (Rule:Rule) => Rule.custom((field,context) => {
                const doc = context.parent as CTALinkParent;
                // Check if the linkType is 'toPage' and the field is empty 
                if (doc?.linkType === 'toPage' && !field) {
                    return 'Please select a page.';
                }
                return true;
            })
        },
        {
            name: 'externalLink',
            title: 'External Link',
            type: 'url',
            hidden: ({ parent, value }: { parent?: CTALinkParent; value?: string}) => !value && parent?.linkType !== 'externalLink',
            validation: (Rule: Rule) => Rule.custom((field,context) => {
                const doc = context.parent as CTALinkParent;
                // Check if the linkType is 'externalLink' and the field is empty 
                if (doc?.linkType === 'externalLink' && !field) {
                    return 'Please enter an external link.';
                }
                return true;
            })
            
        }


    ],
    
}


export default callToAction;
