import type {StructureResolver} from 'sanity/structure'

export const myStructure: StructureResolver = (S) =>
    S.list()
      .title('Base')
      .items([
        S.listItem()
        .title('Projects')
        .child(
            S.list()
                .title('Projects')
                .items([
                    S.listItem()
                        .title('Live Projects')
                        .child(S.document().schemaType('project').documentId('project'))
                ])

        ),
        S.listItem()
            .title('Company Settings')
            .child(
                S.list()
                    .title('Company Settings')

            ),

            S.listItem()
            .title('Site Settings')
            .child(
              S.list()
                .title('Available Settings')
                .items([
                  S.listItem()
                    .title('Site details for search engines')
                    .child(
                      S.document()
                        .schemaType('metaDataSingleton')
                        .documentId('metaDataSingleton') // Use a fixed id for the singleton
                    ),
                  S.listItem()
                    .title('Website page name settings')
                    .child(
                      S.document()
                        .schemaType('pageNamesSingleton')
                        .documentId('pageNamesSingleton') // Use a fixed id for the singleton
                    )
                ])
            ),




                            
        ...S.documentTypeListItems().filter(
            (listItem) => !['metaDataSingleton','pageNamesSingleton','project'].includes(listItem?.getId() ?? '')
            ),
                     ])


        
        
        
        