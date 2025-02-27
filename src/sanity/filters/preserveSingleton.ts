import type { 
    DocumentActionComponent, 
    DocumentActionsContext,
  } from 'sanity'

  // Define the actions that should be available for singleton documents
const singletonActions = new Set(["publish", "discardChanges", "restore"])
const SINGLETON = "Singleton"

export function preserveSingleton (prev: DocumentActionComponent[], context: DocumentActionsContext) {
  
  return context.schemaType.endsWith(SINGLETON) 
      ? prev.filter(({action}) => action && singletonActions.has(action))
      : prev
}

