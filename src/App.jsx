import NoteTaker from './components/NoteTaker.jsx';
import NoteList from './components/NoteList.jsx';
import SectionMaker from './components/SectionMaker.jsx';
import Sections from './components/Sections.jsx';
import Style from "./style/App.less";

export default class App extends React.Component {
  // static propTypes = {
  //   record: quip.rootRecord
  // }

  constructor(props) {
    super();


    this.state = {
      sections: props.record.get('sections'),
      topics: props.record.get('topics'),
      notes: props.record.get('notes'),

      // TODO read this from user/doc preferences?
      currentSections: [],
      showSectionMaker: false
    }
  }

  appendNote = (note) => {
    this.setState({notes: this.state.notes.concat(note)});
  }

  finishSectionMaker = (section) => {
    this.setState({
      sections: this.state.sections.concat(section),
      showSectionMaker: false
    }, () => {
      quip.apps.getRootRecord().set('sections', this.state.sections);
    });
  }

  showSectionMaker = () => {
    this.setState({showSectionMaker: true});
  }

  updateCurrentSections = (section) => {
    if (this.state.currentSections.includes(section)) {
      this.setState({currentSections: this.state.currentSections.filter(s => s !== section)});
    } else {
      this.setState({currentSections: this.state.currentSections.concat(section)});
    }
  }

  render() {
    return <div className={Style.app}>
      <Sections sections={this.state.sections} showSectionMaker={this.showSectionMaker} currentSections={this.state.currentSections} updateCurrentSections={this.updateCurrentSections} />
      {/*<NoteList notes={this.state.notes} currentSections={this.state.currentSections} />*/}
      {/*<NoteTaker noteCreated={this.appendNote} />*/}

      { this.state.showSectionMaker && <SectionMaker sections={this.state.sections} sectionCreated={this.finishSectionMaker} /> }
    </div>;
  }
}
