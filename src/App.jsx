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
      notes: props.record.getAllNotes(),
      searchTerm: '',
      isSearching: false
    };
  }

  componentDidMount() {
    this.noteListener = this.props.record.get('notes').listen(this.getUpdatedNoteState);
  }

  componentWillUnmount() {
    if (this.noteListener !== null) {
      this.props.record.get('notes').unlisten(this.noteListener);
    }
  }

  addNote = () => {
    this.props.record.addNote();
  }

  clearSearch = () => {
    this.setState({
      searchTerm: '',
      isSearching: false
    });
  }

  enableSearch = () => {
    this.setState({
      isSearching: true
    });
  }

  getUpdatedNoteState = (record) => {
    const notes = record.getRecords();

    this.setState({notes: notes});
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

    return <div className={Style.app2}>
      <div className={Style.searchControl}>
        <input type="text" 
          onInput={event => this.setState({searchTerm: event.target.value})} 
          value={this.state.search} />
        <button type="button" className={Button.primary} onClick={this.enableSearch}>search</button>
        <button type="button" className={Button.simple} onClick={this.clearSearch}>clear</button>
        <button type="button" className={Button.simple}>export</button>
      </div>
      
      {notes}
      
      <div className={Style.footerControl}>
        <button type="button" onClick={this.addNote} className={Button.bigBoyPrimary}>add note</button>
      </div>
    </div>;
  }
}
