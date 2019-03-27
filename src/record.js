export class NoteBookRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      topics: 'array',
      notes: quip.apps.RecordList.Type(NoteRecord)
    };
  }

  static getDefaultProperties() {
    return {
      topics: [],
      notes: []
    };
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

  addNote() {
    return this.get('notes').add({topics: []});
  }

  getAllNotes() {
    return this.get('notes').getRecords()
  }
}

export class NoteRecord extends quip.apps.Record {
  static getProperties() {
    return {
      content: quip.apps.RichTextRecord,
      topics: 'array',
      likes: 'array'
    }
  }

  static getDefaultProperties() {
    return {
      content: {
        RichText_placeholderText: 'start adding notes here'
      },
      topics: [],
      likes: []
    }
  }
}
