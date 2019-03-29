import Search from './components/Search.jsx';
import Sections from './components/Sections.jsx';
import NoteList from './components/NoteList.jsx';
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
      isSearching: false,
      currentSections: []
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

    if (this.recordListener !== null) {
      this.props.record.unlisten(this.recordListener);
    }
  }

  addNote = () => {
    this.props.record.addNote(this.state.currentSections[0]);
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

  updateCurrentSections = (currentSections) => {
    this.setState({currentSections: currentSections});
  }

  updateTopics = (topics) => {
    this.props.record.updateTopics(topics);
  }

  render() {
    return <div className={Style.app}>
      <header className={Style.header}>
        <Sections sections={this.state.sections} updateCurrent={this.updateCurrentSections} />
        <Search search={this.search} />
      </header>
      
      <NoteList notes={this.state.notes} 
        isSearching={this.state.isSearching} 
        searchTerm={this.state.searchTerm} 
        currentSections={this.state.currentSections} 
        updateTopics={this.updateTopics} 
        topics={this.state.topics} />
      
      <div className={Style.footerControl}>
        <button type="button" onClick={this.addNote} disabled={(this.state.currentSections.length !== 1)} className={Button.bigBoyPrimary}>add note</button>
      </div>
    </div>;
  }
}
