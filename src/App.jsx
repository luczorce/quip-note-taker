import Search from './components/Search.jsx';
import Sections from './components/Sections.jsx';
import Note from './components/Note.jsx';
import Style from './style/App.less';
import Button from './style/Buttons.less';

export default class App extends React.Component {
  // static propTypes = {
  //   record: quip.rootRecord,
  // }

  recordListener = null;
  noteListener = null;

  constructor(props) {
    super();

    this.state = {
      topics: props.record.get('topics'),
      sections: props.record.get('sections'),
      notes: props.record.getAllNotes(),
      
      searchTerm: '',
      isSearching: false
    };
  }

  componentDidMount() {
    this.noteListener = this.props.record.get('notes').listen(this.getUpdatedNoteState);
    this.recordListener = this.props.record.listen(this.getUpdatedRecordState);
  }

  componentWillUnmount() {
    if (this.noteListener !== null) {
      this.props.record.get('notes').unlisten(this.noteListener);
    }
  }

  addNote = () => {
    this.props.record.addNote();
  }

  getUpdatedNoteState = (record) => {
    const notes = record.getRecords();

    this.setState({notes: notes});
  }

  getUpdatedRecordState = (record) => {
    let updatedState = {};

    // TODO anyway to optimise this with if ??
    updatedState.topics = record.get('topics');
    updatedState.sections = record.get('sections');
    this.setState(updatedState);
  }

  search = (value) => {
    let updatedState = {
      searchTerm: value
    };

    if (value.length) {
      updatedState.isSearching = true;
    } else {
      updatedState.isSearching = false;
    }

    this.setState(updatedState);
  }

  searchForNotes = () => {
    // TODO search for more than just the topics
    return this.state.notes.filter(n => {
      const topics = n.get('topics').map(t => t.toLowerCase());

      const match = topics.includes(this.state.searchTerm.toLowerCase());
      return match;
    });
  }

  updateTopics = (topics) => {
    this.props.record.updateTopics(topics);
  }

  render() {
    let notes;

    if (this.state.isSearching) {
      notes = this.searchForNotes();
      
      if (notes.length) {
        notes = <div className={Style.noteList}>
          {notes.map(n => {
            return <Note note={n} globalTopics={this.state.topics} updateGlobalTopics={this.updateTopics} />;
          })}
        </div>;
      } else {
        notes = <p>no results from {this.state.searchTerm}</p>;
      }
    } else if (this.state.notes.length) {
      notes = <div className={Style.noteList}>
        {this.state.notes.map(n => {
          return <Note note={n} globalTopics={this.state.topics} updateGlobalTopics={this.updateTopics} />;
        })}
      </div>;
    } else {
      notes = <p>no notes yet.. add one!</p>;
    }

    return <div className={Style.app}>
      <header className={Style.header}>
        <Sections sections={this.state.sections} />
        <Search search={this.search} />
      </header>
      
      {notes}
      
      <div className={Style.footerControl}>
        <button type="button" onClick={this.addNote} className={Button.bigBoyPrimary}>add note</button>
      </div>
    </div>;
  }
}
