import type {StructureResolver} from 'sanity/structure'

export const myStructure: StructureResolver = (S) =>
    S.list()
      .title('Base')
      .items([
        S.listItem()
            .title('Metadata')
            .child(
                S.document()
                    .schemaType('metaData')
                    .documentId('metaData')),
                    ...S.documentTypeListItems().filter(listItem => {
                        const id = listItem.getId();
                        return id !== undefined && !['metaData'].includes(id);
                    })
                ])