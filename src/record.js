export class NoteBookRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      notes: quip.apps.RecordList.Type(NoteRecord),
      topics: 'array',
      sections: 'array'
    };
  }

  static getDefaultProperties() {
    return {
      notes: [],
      topics: [],
      sections: []
    };
  }

  addNote(noteData) {
    this.get('notes').add(noteData);
  }

  getAllNotes() {
    const notes = quip.apps.getRootRecord()
          .get('notes')
          .getRecords()
          .map(r => {
            return {
              note: r.get('content'), 
              topics: r.get('topics'), 
              owner: r.get('owner')
            };
          });

    return notes;
  }

  updateTopics = (topics) => {
    let current = this.get('topics');
    
    topics.forEach(t => {
      if (current.indexOf(t) === -1) {
        current.push(t);
      }
    });

    this.set('topics', current);
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
      topics: 'array',
      guid: 'string'
    }
  }
}
