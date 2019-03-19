import Style from '../style/Notes.less';
import Message from '../style/Message.less';

export default class NoteList extends React.Component {
  static propTypes = {
    notes: React.PropTypes.array,
    currentSections: React.PropTypes.array
  };

  getCurrentNotes = () => {
    return this.props.notes.filter(n => {
      let isPresent = false;
      this.props.currentSections.forEach(s => {
        if (n.topics.includes(s)) {
          isPresent = true;
        }
      });

      return isPresent;
    });
  }

  makeEachNote = (note) => {
    let topics = note.topics.filter(t => t !== this.props.currentSection);
    
    topics = topics.map(t => {
      if (t[0] === '#') {
        return <span className={Style.noteTopic}>{t}</span>;
      } else {
        return <span className={Style.noteSection}>{t}</span>;
      }
    });

    return <div key={note.guid} className={Style.note}>
      <p className={Style.content}>{note.content}</p>
      <div className={Style.topicList}>{topics}</div>
      <p className={Style.owner}>{quip.apps.getUserById(note.owner).getName()}</p>
    </div>;
  }

  render() {
    const currentNotes = this.getCurrentNotes();
    let notes;

    if (currentNotes.length) {
      notes = currentNotes.map(this.makeEachNote);
    } else {
      notes = <p>add notes to get started</p>;
    }

    return <div className={Style.noteList}>{notes}</div>;
  }
}
