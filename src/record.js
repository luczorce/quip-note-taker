export class NoteBookRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      notes: quip.apps.RecordList.Type(NoteRecord),
      notesInProgress: quip.apps.RecordList.Type(NoteInProgressRecord),
      topics: 'array',
      sections: 'array'
    };
  }

  static getDefaultProperties() {
    return {
      notesInProgress: [],
      notes: [],
      topics: [],
      sections: []
    };
  }

  addNote(noteData) {
    this.get('notes').add(noteData);
  }

  addNoteInProgress(userId) {
    return this.get('notesInProgress').add({  
      owner: userId,
      // NOTE
      // we can not add placeholder text to the record, like so:
      // thought: { RichText_placeholderText: "add your thoughts" }
      // it registers as text, so an empty text box will register as not empty
      thought: { RichText_placeholderText: '' }
    });
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

  getAllNotesInProgress() {
    const notes = quip.apps.getRootRecord()
          .get('notesInProgress')
          .getRecords()
          .map(r => r.getData());

    return notes;
  }

  getNoteInProgress(userId) {
    return quip.apps.getRootRecord()
          .get('notesInProgress')
          .getRecords()
          .map(r => r.getData())
          .find(n => n.owner === userId);
  }

  toggleNoteLike(noteGuid, user, isLike) {
    const note = quip.apps.getRootRecord()
          .get('notes')
          .getRecords()
          .find(r => r.get('guid') === noteGuid);

    if (!note) return;

    let likes = note.get('likes');
    
    if (isLike) {
      likes.push(user);
    } else {
      const index = likes.indexOf(user);

      if (index !== -1) {
        likes.splice(index, 1);
      }
    }

    note.set('likes', likes);
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
    //   guid: 'kjhgkj-kdjhffhg-hehehfjehf',
    //   likes: ['quipUserId', 'quipUserId2']
    // }
    return {
      content: 'string',
      owner: 'string',
      topics: 'array',
      guid: 'string',
      likes: 'array'
    };
  }

  static getDefaultProperties() {
    return {
      content: '',
      likes: [],
      topics: [],
      owner: '',
      guid: ''
    }
  }
}

export class NoteInProgressRecord extends quip.apps.Record {
  static getProperties() {
    return {
      thought: quip.apps.RichTextRecord,
      owner: 'string'
    };
  }
}
