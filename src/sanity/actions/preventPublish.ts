import type { 
    DocumentActionComponent, 
    DocumentActionsContext, 
    DocumentActionProps, 
    DocumentActionDescription 
  } from 'sanity'

  export function preventPublish (prev: DocumentActionComponent[], context: DocumentActionsContext) {
    const blockedTypes = ['metaData']
    if (!context.schemaType || !blockedTypes.includes(context.schemaType)) {
      return prev
    }
    return prev.map((originalAction: DocumentActionComponent): DocumentActionComponent => {
      // Wrap the action in a new function that calls the original and then modifies its description if needed.
      return (props: DocumentActionProps): DocumentActionDescription | null => {
        const description = originalAction(props);
        if (description && description.label === 'Publish' && !props.published) {
          return {
            ...description,
            disabled: true,
            title: `You cannot publish because there should only be one type of ${context.schemaType}.`,
          }
        }
        return description
      }
    })
  }