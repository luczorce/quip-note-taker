import NoteTaker from './components/NoteTaker.jsx';
import NoteList from './components/NoteList.jsx';
import SectionMaker from './components/SectionMaker.jsx';
import Sections from './components/Sections.jsx';
import Style from "./style/App.less";

export default class App extends React.Component {
  // static propTypes = {
  //   record: quip.rootRecord,
  //   userThought: { userId: 'kdjfhkdjf', thought: quip.RichTextRecord}
  // }

  recordListener = null;

  constructor(props) {
    super();

    const sections = props.record.get('sections');
    const currentSections = (sections.length) ? [sections[0]] : [];

    this.state = {
      sections: sections,
      topics: props.record.get('topics'),
      notes: props.record.getAllNotes(),

      // TODO read this from a record?...
      currentSections: currentSections,
      showSectionMaker: false
    };
  }

  componentDidMount() {
    let rootRecord = quip.apps.getRootRecord();
    this.recordListener = rootRecord.listen(this.getUpdatedState);
  }

  componentWillUnmount() {
    if (this.recordListener !== null) {
      let rootRecord = quip.apps.getRootRecord();
      rootRecord.unlisten(this.recordListener);
    }
  }

  getUpdatedState = (record) => {
    const notes = record.getAllNotes();
    const topics = record.get('topics');
    const sections = record.get('sections');

    console.log(notes.length, this.state.notes.length);

    this.setState({
      notes: notes,
      topics: topics,
      sections: sections
    });
  }

  //////

  addAllToCurrentSections = () => {
    this.setState({currentSections: this.state.sections});
  }

  finishSectionMaker = (section) => {
    let updatedState = {
      showSectionMaker: false
    };

    if (section !== null) {
      if (this.state.currentSections.length > 1) {
        updatedState.currentSections = this.state.currentSections.concat(section);  
      } else {
        updatedState.currentSections = [section]
      }
    }

    this.setState(updatedState);
  }

  removeAllToCurrentSections = () => {
    this.setState({currentSections: []});
  }

  showSectionMaker = () => {
    this.setState({showSectionMaker: true});
  }

  updateCurrentSections = (section, isAdd) => {
    if (isAdd) {
      if (this.state.currentSections.includes(section)) {
        this.setState({currentSections: this.state.currentSections.filter(s => s !== section)});
      } else {
        this.setState({currentSections: this.state.currentSections.concat(section)});
      }
    } else {
      this.setState({currentSections: [section]});
    }
  }

  render() {
    return <div className={Style.app}>
      <Sections sections={this.state.sections} 
          showSectionMaker={this.showSectionMaker} 
          currentSections={this.state.currentSections} 
          update={this.updateCurrentSections} 
          addAll={this.addAllToCurrentSections}
          removeAll={this.removeAllToCurrentSections} />
      <NoteList notes={this.state.notes} currentSections={this.state.currentSections} />
      <NoteTaker thought={this.props.userThought} currentSections={this.state.currentSections} />

      { this.state.showSectionMaker && <SectionMaker sections={this.state.sections} sectionCreated={this.finishSectionMaker} /> }
    </div>;
  }
}
