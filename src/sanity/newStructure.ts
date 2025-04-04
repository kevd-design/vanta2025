import type {StructureResolver} from 'sanity/structure'

export const myStructure: StructureResolver = (S) =>
  
  S.list()
  
    .title('Editable Content')

    //List all document types except singletons

    .items([
      ...S.documentTypeListItems()
        .filter(
          (listItem) => !listItem?.getId()?.endsWith('Singleton')
          ),
        
      //Add a divider
      S.divider(),

      //Add the singletons ensuring they open immediately in the editor,
      //and not in a list view like the other non-singleton document types
      // by specifying the exact documentId
      S.listItem()
      .id('companySettingsSingleton')
      .schemaType('companySettingsSingleton')
      .title('Company Settings')
      .child(
        S.editor()
          .id('companySettingsSingleton')
          .schemaType('companySettingsSingleton')
      ),
      S.listItem()
      .id('siteSettingsSingleton')
      .schemaType('siteSettingsSingleton')
      .title('Site Settings')
      .child(
        S.editor()
          .id('metaDataSingleton')
          .schemaType('siteSettingsSingleton')
      ),
    
    
  ])
  
  



        
        
        
        