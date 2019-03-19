import Style from '../style/Notes.less';
import Message from '../style/Message.less';

export default class NoteList extends React.Component {
  static propTypes = {
    notes: React.PropTypes.array,
    currentSections: React.PropTypes.array
  };

  names = {};

  constructor(props) {
    super();

    props.notes.forEach(n => {
      if (!this.names.hasOwnProperty(n.owner)) {
        let owner = quip.apps.getUserById(n.owner);
        console.log(owner);
        
        if (owner !== null) {
          this.names[n.owner] = owner.getName();
        }
      }
    });
  }

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

  getName = (owner) => {
    if (this.names.hasOwnProperty(owner)) {
      return this.names[owner];
    } else {
      let name = quip.apps.getUserById(owner);
      
      if (name !== null) {
        name = name.getName();
        this.names[owner] = name;
      } else {
        name = '';
        console.log('WHY cant we find the name from a valid quip user id?');
      }

      return name;
    }
  }

  makeEachNote = (note) => {
    let topics = note.topics.filter(t => t !== this.props.currentSection);
    
    topics = topics.map(t => {
      if (t[0] === '#') {
        return <span className={Style.noteTopic}>{t}</span>;
      } else {
        if (this.props.currentSections.length > 1) {
          return <span className={Style.noteSection}>{t}</span>;
        }
      }
    });

    // NOTE rendering the app on load with a selected section
    // made quip.apps.getUserById() return null
    // and this won't show anything until the first add
    let name = this.getName(note.owner);

    return <div key={note.guid} className={Style.note}>
      <p className={Style.content}>{note.content}</p>
      <div className={Style.topicList}>{topics}</div>
      <p className={Style.owner}>{name}</p>
    </div>;
  }

  render() {
    const currentNotes = this.getCurrentNotes();
    let notes;

    if (currentNotes.length) {
      notes = currentNotes.map(this.makeEachNote);
    } else if (!this.props.currentSections.length) {
      notes = <p>select sections to see their notes</p>;
    } else {
      notes = <p>add notes below!</p>;
    }

    return <div className={Style.noteList}>{notes}</div>;
  }
}
