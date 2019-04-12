export class NoteBookRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      topics: 'array',
      sections: 'array',
      notes: quip.apps.RecordList.Type(NoteRecord)
    };
  }

  static getDefaultProperties() {
    return {
      topics: [],
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
    return {
      content: quip.apps.RichTextRecord,
      topics: 'string',
      likes: 'array',
      section: 'string'
    }
  }

  static getDefaultProperties() {
    return {
      content: {
        RichText_placeholderText: 'start adding notes here'
      },
      topics: '',
      likes: [],
      section: ''
    }
  }

  toggleLike(userId) {
    let likeList = this.get('likes');
    const likerPosition = likeList.indexOf(userId);
    const hasLiked = likerPosition !== -1;
    
    if (hasLiked) {
      likeList.splice(likerPosition, 1);
    } else {
      likeList = likeList.concat(userId);
    }

    this.set('likes', likeList);
  }
}
