import Note from './Note.jsx';
import Style from '../style/Notes.less';
import Message from '../style/Message.less';
import Button from '../style/Buttons.less';

export default class NoteList extends React.Component {
  static propTypes = {
    notes: React.PropTypes.array, // of NoteRecords
    currentSections: React.PropTypes.array,
    isSearching: React.PropTypes.boolean,
    searchTerm: React.PropTypes.string,
    updateTopics: React.PropTypes.func
  };

  addNote = () => {
    quip.apps.getRootRecord().addNote(this.props.currentSections[0]);
  }

  getCurrentNotes = () => {
    return this.props.notes.filter(n => this.props.currentSections.includes(n.get('section')));
  }

  searchForNotes = () => {
    // TODO search for more than just the topics
    return this.props.notes.filter(n => {
      const topics = n.get('topics').map(t => t.toLowerCase());

      const match = topics.includes(this.props.searchTerm.toLowerCase());
      return match;
    });
  }

  notesWereUpdatedInChildren = () => {
    this.forceUpdate();
  }

  //////

  renderNotes = (notes) => {
    return notes.map(n => {
      return <Note 
        key={n.getId()}
        note={n}
        updateGlobalTopics={this.props.updateTopics}
        filterNotesAgain={this.notesWereUpdatedInChildren} 
        showSection={this.props.currentSections.length > 1} />;
    });
  }

  renderSearch = () => {
    let notes = this.searchForNotes();
      
    if (notes.length) {
      return this.renderNotes(notes);
    } else {
      return this.renderNoResults();
    }
  }

  renderEmpty = () => {
    return <p className={Message.emptyNotice}>
      <BigNoteIcon />
      <br/>
      add notes below!
    </p>;
  }

  renderNoResults = () => {
    return <p className={Message.emptyNotice}>
      <BigEmptySearchIcon />
      <br/>
      no results for "{this.props.searchTerm}"
    </p>;
  }

  renderNotReady = () => {
    return <p className={Message.emptyNotice}>
      <BigSectionIcon />
      <br/>
      select sections to see their notes
    </p>;
  }

  render() {
    let content;

    if (this.props.isSearching) {
      content = this.renderSearch();
    } else if (!this.props.currentSections.length) {
      content = this.renderNotReady();
    } else {
      const currentNotes = this.getCurrentNotes();

      if (currentNotes.length) {
        content = this.renderNotes(currentNotes);
      } else {
        content = this.renderEmpty();
      }
    }
    
    return <div className={Style.noteList}>
      {content}

      <div className={Style.footer}>
        <button type="button" onClick={this.addNote} disabled={(this.props.currentSections.length !== 1)} className={Button.bigBoyPrimary}>add note</button>
      </div>
    </div>;
  }
}

function BigSectionIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
}

function BigNoteIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
}

function BigEmptySearchIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
}
