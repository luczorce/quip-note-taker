import ReactHtmlParser from 'react-html-parser';
import mdRender from '../util/markdown-renderer.js';
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
        
        if (owner !== null) {
          this.names[n.owner] = owner.getName();
        }
      }
    });

    this.containerElement = null;
    this.setContainerElementRef = element => {
      this.containerElement = element;
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const moreNotes = Boolean(nextProps.notes.length !== this.props.notes.length);

    let sectionChange = false;
    let sectionLengths = {
      current: this.props.currentSections.length,
      next: nextProps.currentSections.length
    };

    if (sectionLengths.current !== sectionLengths.next) {
      sectionChange = true;
    } else if (sectionLengths.current === 1 && sectionLengths.next === 1 && this.props.currentSections[0] !== nextProps.currentSections[0]) {
      sectionChange = true;
    }
    
    if (moreNotes || sectionChange) {
      console.log('yes scroll to the bottom!!');
      this.scrollToBottom();
    }

    // always update when react thinks it's best
    return true;
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
        // console.log('WHY cant we find the name from a valid quip user id?');
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
    // and name (below) won't show anything until the first add (of note or section)
    let name = this.getName(note.owner);
    
    let content = mdRender(note.content);
    content = ReactHtmlParser(content);

    return <div key={note.guid} className={Style.note}>
      <div className={Style.content}>{content}</div>
      <div className={Style.topicList}>{topics}</div>
      <p className={Style.owner}>{name}</p>
    </div>;
  }

  scrollToBottom = () => {
    // wait for the state to update o.o
    window.setTimeout(() => {
      this.containerElement.scrollTop = this.containerElement.scrollHeight;
    }, 100);
  }

  render() {
    const currentNotes = this.getCurrentNotes();
    let notes;

    if (currentNotes.length) {
      notes = currentNotes.map(this.makeEachNote);
    } else if (!this.props.currentSections.length) {
      notes = <p className={Message.emptyNotice}>
        <BigSectionIcon />
        <br/>
        select sections to see their notes
      </p>;
    } else {
      notes = <p className={Message.emptyNotice}>
        <BigNoteIcon />
        <br/>
        add notes below!
      </p>;
    }

    return <div className={Style.noteList} ref={this.setContainerElementRef}>{notes}</div>;
  }
}

function BigSectionIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="arcs"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg>;
}

function BigNoteIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
}
