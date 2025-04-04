import type { Rule } from 'sanity';
interface CTATargetDocument {
    CTA?: {
      linkType?: 'reference' | 'toPage' | 'externalLink';
    };
  }

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
            hidden: ({ document }: {document: CTATargetDocument}) => document?.CTA?.linkType !== 'reference',
            validation: (Rule: Rule) => Rule.custom((field,context) => {
                const doc = context.document as CTATargetDocument;
                if (doc?.CTA?.linkType === 'reference' && !field) {
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
            hidden: ({ document }: {document: CTATargetDocument}) => document?.CTA?.linkType !== 'toPage',
            validation: (Rule:Rule) => Rule.custom((field,context) => {
                const doc = context.document as CTATargetDocument;
                // Check if the linkType is 'toPage' and the field is empty 
                if (doc?.CTA?.linkType === 'toPage' && !field) {
                    return 'Please select a page.';
                }
                return true;
            })
        },
        {
            name: 'externalLink',
            title: 'External Link',
            type: 'url',
            hidden: ({ document }: {document: CTATargetDocument}) => document?.CTA?.linkType !== 'externalLink',
            validation: (Rule: Rule) => Rule.required().error('Please enter a URL.')
        }


    ],
    
}


export default callToAction;
