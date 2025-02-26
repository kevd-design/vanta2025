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
                            .child(S.document().schemaType('metaData').documentId('metaData')),

                        S.listItem()
                            .title('Website page name settings')
                            .child(S.document().schemaType('pages').documentId('pages'))
                    ])
                ),
        
        
        
        
        ...S.documentTypeListItems().filter(
            (listItem) => !['metaData','pages'].includes(listItem?.getId() ?? '')
            ),
        ],
                
        )