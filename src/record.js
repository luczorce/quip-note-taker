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

  appendSection(section) {
    let sections = this.get('sections');
    this.set('sections', sections.concat(section));
  }

  getAllNotes() {
    const notes = quip.apps.getRootRecord()
          .get('notes')
          .getRecords()
          .map(r => r.getData());

    return notes;
  }

  updateTopics(topics) {
    const current = this.get('topics');
    let newTopics = [];
    
    topics.forEach(t => {
      if (current.indexOf(t) === -1) {
        newTopics.push(t);
      }
    });

    if (newTopics.length) {
      this.set('topics', current.concat(newTopics));
    }
  }
}

export class NoteRecord extends quip.apps.Record {
  static getProperties() {
    // example
    // {
    //   content: 'This is something that the person typed into the notebox',
    //   owner: quip.apps.getViewingUser().getId(),
    //   topics: ['artifical intelligence', 'ethics'],
    //    guid: 'kjhgkj-kdjhffhg-hehehfjehf'
    // }
    return {
      content: quip.apps.RichTextRecord,
      owner: 'string',
      topics: 'array',
      guid: 'string'
    };
  }

  static getDefaultProperties() {
    return {
      content: { RichText_placeholderText: 'add your thoughts...' },
      owner: null,
      topics: [],
      guid: null
    };
  }
}
