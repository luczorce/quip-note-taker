import Search from './components/Search.jsx';
import Sections from './components/Sections.jsx';
import NoteList from './components/NoteList.jsx';
import TopicDefiner from './components/TopicDefiner.jsx';
import Exporter from './components/Exporter.jsx';
import {makeNewDocument} from './util/automation.js';
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
  currentNotes = [];

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
      showTopicDefiner: false,
      showExportWindow: false,
      exportDestination: null
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
      toolbarCommandIds: [ 'topicParent', 'exportParent' ],
      menuCommands: [
        {
          id: 'topicParent',
          label: 'topics',
          subCommands: ['predefinedTopics']
        },
        {
          id: 'predefinedTopics',
          label: 'define default topics',
          handler: () => {
            this.setState({showTopicDefiner: true});
            quip.apps.updateToolbar({
              disabledCommandIds: ['exportParent']
            });
          }
        },
        {
          id: 'exportParent',
          label: 'export',
          subCommands: ['exportToQuip']
        },
        {
          id: 'exportToQuip',
          label: 'to new Quip document',
          handler: () => {
            this.setState({showExportWindow: true, exportDestination: 'quip'});
            quip.apps.updateToolbar({
              disabledCommandIds: ['topicParent']
            });
          }
        },
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

  exportToQuip = (token, whichNotes) => {
    let title = 'Note Export';
    let exportLine;
    let content = '';
    let sections = [];
    let now = new Date();
    let date = `${now.getMonth() + 1}/${now.getDate()}`;

    if (whichNotes === 'search') {
      title += ` | Search Results`;
      exportLine = `_Search on (${this.state.searchTerm}) exported on ${date}_`;
      
    } else if (whichNotes === 'all') {
      title += ' | All Notes'
      exportLine = `_Every note exported on ${date}_`;

      this.state.sections.forEach(s => {
        sections[s] = this.state.notes.filter(n => n.get('section') === s);
      });
    } else if (whichNotes === 'section') {
      title += ' | ' + this.state.currentSections.join(', ');
      exportLine = `_These sections exported on ${date}_`;

      this.state.currentSections.forEach(s => {
        sections[s] = this.currentNotes.filter(n => n.get('section') === s);
      });
    }

    content += `# ${title}`;
    content += '\n\n';
    
    content += exportLine
    content += '\n\n';
    content += '<hr>';
    content += '\n\n';

    if (whichNotes === 'search') {
      this.currentNotes.forEach((n, index, currentNotes) => {
        content += n.get('content').getTextContent();
        content += '\n\n';
        content += `***topics**: ${n.get('topics')}*`;
        content += '\n\n';
        content += `***section**: ${n.get('section')}*`;
        content += '\n';

        if (index !== currentNotes.length - 1) {
          content += '<hr>\n\n';
        }
      });
    } else {
      Object.keys(sections).forEach((s, index, sectionKeys) => {
        content += '# ' + s;
        content += '\n\n';
        
        sections[s].forEach(n => {
          content += n.get('content').getTextContent();
          // content += '\n';
          content += `***topics**: ${n.get('topics')}*`;
          content += '\n\n';
        });

        if (index !== sectionKeys.length - 1) {
          content += '<hr>\n\n';
        }
      });
    }

    return makeNewDocument(token, content, title);
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
    quip.apps.updateToolbar({
      disabledCommandIds: []
    });
  }
  
  hideExporter = (result) => {
    this.setState({showExportWindow: false, exportDestination: null});
    quip.apps.updateToolbar({
      disabledCommandIds: []
    });
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

  updateCurrentNotes = (currentNotes) => {
    this.currentNotes = currentNotes;
  }

  updateTopics = (topics) => {
    this.props.record.updateTopics(topics);
  }

  render() {
    return <div className={Style.app}>
      {this.state.showTopicDefiner && <TopicDefiner predefinedTopics={this.state.defaultTopics} finished={this.hideTopicDefiner} />}
      
      {!this.state.showTopicDefiner && !this.state.showExportWindow && (
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
            updateTopics={this.updateTopics}
            updateCurrentNotes={this.updateCurrentNotes} 
            />
          </div>
        )}
      
      {this.state.showExportWindow && <Exporter 
        destination={this.state.exportDestination}
        exportToQuip={this.exportToQuip}
        finished={this.hideExporter} />}
    </div>;
  }
}
