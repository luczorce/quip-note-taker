import NoteTaker from './components/NoteTaker.jsx';
import NoteList from './components/NoteList.jsx';
import SectionMaker from './components/SectionMaker.jsx';
import Sections from './components/Sections.jsx';
import Style from "./style/App.less";

export default class App extends React.Component {
  // static propTypes = {
  //   record: quip.rootRecord,
  //   scratchpad: record, getData() > { userId: 'kdjfhkdjf', thought: quip.RichTextRecord}
  // }

  recordListener = null;
  noteListener = null;

  constructor(props) {
    super();

    // const sections = props.record.get('sections');
    // const currentSections = (sections.length) ? [sections.sort()[0]] : [];

    this.state = {
      topics: props.record.get('topics'),
      // notes: props.record.getAllNotesTwo(),

      addNote: false
    };
  }

  // componentDidMount() {
    // let rootRecord = quip.apps.getRootRecord();
    // this.recordListener = rootRecord.listen(this.getUpdatedState);
    // this.noteListener = rootRecord.get('notes').listen(this.getUpdatedNoteState);
  // }

  toggleAddNote = () => {
    this.setState({ addNote: !this.state.addNote });
  }

  // componentWillUnmount() {
  //   let rootRecord = quip.apps.getRootRecord();
    
  //   if (this.recordListener !== null) {
  //     rootRecord.unlisten(this.recordListener);
  //   }

  //   if (this.noteListener !== null) {
  //     rootRecord.get('notes').unlisten(this.noteListener);
  //   }    
  // }

  // getUpdatedState = (record) => {
  //   const topics = record.get('topics');
  //   const sections = record.get('sections');
  //   let update = {}, shouldUpdate = false;

  //   if (topics.length !== this.state.topics.length) {
  //     update.topics = topics;
  //     shouldUpdate = true;
  //   }

  //   if (sections.length !== this.state.length) {
  //     update.sections = sections;
  //     shouldUpdate = true;
  //   }

  //   if (shouldUpdate) {
  //     this.setState(update);
  //   }
  // }

  // getUpdatedNoteState = (record) => {
  //   const notes = record.getRecords().map(r => r.getData());

  //   this.setState({notes: notes});
  // }

  // //////

  // addAllToCurrentSections = () => {
  //   this.setState({currentSections: this.state.sections});
  // }

  // finishSectionMaker = (section) => {
  //   let updatedState = {
  //     showSectionMaker: false
  //   };

  //   if (section !== null) {
  //     if (this.state.currentSections.length > 1) {
  //       updatedState.currentSections = this.state.currentSections.concat(section);  
  //     } else {
  //       updatedState.currentSections = [section]
  //     }
  //   }

  //   this.setState(updatedState);
  // }

  // removeAllToCurrentSections = () => {
  //   this.setState({currentSections: []});
  // }

  // showSectionMaker = () => {
  //   this.setState({showSectionMaker: true});
  // }

  // updateCurrentSections = (section, isAdd) => {
  //   if (isAdd) {
  //     if (this.state.currentSections.includes(section)) {
  //       this.setState({currentSections: this.state.currentSections.filter(s => s !== section)});
  //     } else {
  //       this.setState({currentSections: this.state.currentSections.concat(section)});
  //     }
  //   } else {
  //     this.setState({currentSections: [section]});
  //   }
  // }

  render() {
    return <div className={Style.app2}>
      <div className={Style.controls}>
        <button type="button">add note</button>
      </div>

      <h1>app</h1>

    </div>;
  }
}
