export class NoteBookRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      topics: 'array',
      defaultTopics: 'array',
      sections: 'array',
      notes: quip.apps.RecordList.Type(NoteRecord)
    };
  }

  static getDefaultProperties() {
    return {
      topics: [],
      defaultTopics: [],
      sections: [],
      notes: []
    };
  }

  addNote(section) {
    return this.get('notes').add({
      section: section
    });
  }

  addSection(section) {
    let sections = this.get('sections');
    this.set('sections', sections.concat(section));
  }

  deleteNote(note) {
    this.get('notes').remove(note);
  }

  deleteSection(section) {
    let sections = this.get('sections');
    this.set('sections', sections.filter(s => s !==section));
  }

  getAllNotes() {
    return this.get('notes').getRecords();
  }

  getNotesFor(section) {
    return this.get('notes').getRecords().filter(n => n.get('section') === section);
  }

  renameSection(section, newName) {
    let sections = this.get('sections');
    let position = sections.indexOf(section);
    
    if (position === -1) return false;
    sections.splice(position, 1, newName)
    this.set('sections', sections);
    
    let notes = this.get('notes').getRecords();
    notes.forEach(n => { 
      if (n.get('section') === section) {
        n.set('section', newName);
      }
    });
  }

  updateDefaultTopics(topics) {
    this.set('defaultTopics', topics);
  }

  updateTopics(topics) {
    const current = this.get('topics');
    const defaultTopics = this.get('defaultTopics');
    let newTopics = [];
    
    topics.forEach(t => {
      if (defaultTopics.includes(t)) return;
      if (current.includes(t)) return;

      newTopics.push(t);
    });

    if (newTopics.length) {
      this.set('topics', current.concat(newTopics));
    }
  }
}

export class NoteRecord extends quip.apps.Record {
  static getProperties() {
    return {
      content: quip.apps.RichTextRecord,
      topics: 'string',
      section: 'string'
    }
  }

  static getDefaultProperties() {
    return {
      content: {
        RichText_placeholderText: 'start adding notes here'
      },
      topics: '',
      section: ''
    }
  }
}
