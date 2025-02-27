const metaData = {
    name: 'metaDataSingleton',
    title: 'Site details for search engines',
    subtitle: 'AKA Metadata',
    type: 'document',
    preview: {
      prepare() {
          return {
              title: 'Site details for search engines',
          }
      }
  },
    fields: [
      {
        name: 'Sitetitle',
        title: 'Site Title',
        type: 'string'
      },
      {
        name: 'description',
        title: 'Site Description',
        type: 'text'
      }
    ]
  };

export default metaData;