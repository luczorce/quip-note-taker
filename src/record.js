export class NoteBookRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      notes: quip.apps.RecordList.Type(NoteRecord),
      topics: 'array'
    };
  }

  static getDefaultProperties() {
    return {
      notes: [],
      topcis: []
    };
  }
}

export class NoteRecord extends quip.apps.Record {
  static getProperties() {
    // example
    // {
    //   content: 'This is something that the person typed into the notebox',
    //   owner: quip.apps.getViewingUser().getId(),
    //   topics: ['artifical intelligence', 'ethics']
    // }
    return {
      content: 'string',
      owner: 'string',
      topics: 'array'
    }
  }
}
