const metaData = {
    name: 'metaData',
    title: 'Meta Data',
    type: 'document',
    preview: {
      prepare() {
          return {
              title: 'Site details for search engines'
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