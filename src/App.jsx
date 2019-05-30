import Search from './components/Search.jsx';
import Sections from './components/Sections.jsx';
import NoteList from './components/NoteList.jsx';
import TopicDefiner from './components/TopicDefiner.jsx';
import Style from './style/App.less';

export default class App extends React.Component {
  // static propTypes = {
  //   record: quip.rootRecord,
  // }

  static childContextTypes = {
    sections: React.PropTypes.array,
    topics: React.PropTypes.array
  };

  recordListener = null;
  noteListener = null;

  constructor(props) {
    super();

    this.state = {
      topics: props.record.get('topics'),
      sections: props.record.get('sections'),
      notes: props.record.getAllNotes(),
      defaultTopics: props.record.get('defaultTopics'),
      
      searchTerm: '',
      searchTopics: true,
      searchContent: false,
      isSearching: false,
      currentSections: [],
      noteCount: null,
      showTopicDefiner: false
    };
  }

  getChildContext() {
    return {
      sections: this.state.sections,
      topics: this.state.topics.concat(this.state.defaultTopics)
    };
  }

  componentDidMount() {
    this.setState( {noteCount: this.getNoteCount(this.state.notes)} );
    this.noteListener = this.props.record.get('notes').listen(this.getUpdatedNoteState);
    this.recordListener = this.props.record.listen(this.getUpdatedRecordState);

    quip.apps.updateToolbar({
      toolbarCommandIds: [ 'topicParent' ],
      menuCommands: [
        {
          id: 'topicParent',
          label: 'topics',
          subCommands: ['predefinedTopics']
        },
        {
          id: 'predefinedTopics',
          label: 'define default topics',
          handler: () => this.setState({showTopicDefiner: true})
        }
      ]
    });
  }

  componentWillUnmount() {
    if (this.noteListener !== null) {
      this.props.record.get('notes').unlisten(this.noteListener);
    }

    if (this.recordListener !== null) {
      this.props.record.unlisten(this.recordListener);
    }
  }

  getNoteCount = (notes) => {
    let noteCount = {};

    this.state.sections.forEach(s => noteCount[s] = 0);
    notes.forEach(n => noteCount[n.get('section')]++);

    return noteCount;
  }

  getUpdatedNoteState = (record) => {
    const notes = record.getRecords();
    const noteCount = this.getNoteCount(notes);
   
    this.setState({
      notes: notes,
      noteCount: noteCount
    });
  }

  getUpdatedRecordState = (record) => {
    let updatedState = {};

    updatedState.topics = record.get('topics');
    updatedState.sections = record.get('sections');
    updatedState.defaultTopics = record.get('defaultTopics');
    this.setState(updatedState);
  }

  hideTopicDefiner = () => {
    this.setState({showTopicDefiner: false});
  }

  search = (value, filterByTopic = true, filterByContent = false) => {
    let updatedState = {
      searchTerm: value,
      searchTopics: filterByTopic,
      searchContent: filterByContent
    };

    if (value !== null) {
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
      {this.state.showTopicDefiner && <TopicDefiner predefinedTopics={this.state.defaultTopics} finished={this.hideTopicDefiner} />}
      
      {!this.state.showTopicDefiner && (
        <div>
          <header className={Style.header}>
            {!this.state.isSearching && <Sections sections={this.state.sections} noteCount={this.state.noteCount} updateCurrent={this.updateCurrentSections} />}
            <Search search={this.search} />
          </header>
          
          <NoteList notes={this.state.notes} 
            isSearching={this.state.isSearching} 
            searchTerm={this.state.searchTerm}
            searchContent={this.state.searchContent}
            searchTopics={this.state.searchTopics} 
            currentSections={this.state.currentSections} 
            updateTopics={this.updateTopics} />
          </div>
        )}
    </div>;
  }
}
