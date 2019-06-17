import { debounce } from 'throttle-debounce';
import Style from '../style/Notes.less';
import Form from '../style/Form.less';
import Message from '../style/Message.less';
import Button from '../style/Buttons.less';
import {richTextAllowedStyles} from '../util/richtext-record-styles.js';

export default class Note extends React.Component {
  static propTypes = {
    // note is really the NoteRecord
    note: React.PropTypes.object,
    updateGlobalTopics: React.PropTypes.func,
    filterNotesAgain: React.PropTypes.func,
    showSection: React.PropTypes.bool
  };

  static contextTypes = {
    sections: React.PropTypes.array,
    topics: React.PropTypes.array,
  }

  recordListener = null;

  constructor(props) {
    super();

    this.state = {
      topics: props.note.get('topics'),
      section: props.note.get('section'),
      matchingTopics: [],
      showAdvanced: false,
      deleting: false,
      moving: false,
      destination: null
    };
  }

  componentDidMount() {
    this.updateTopicsOnRecord = debounce(300, this.updateTopicsOnRecord);
    this.recordListener = this.props.note.listen(this.updateNoteFromRecord);
  }

  componentWillUnmount() {
    if (this.recordListener !== null) {
      this.props.note.unlisten(this.recordListener);
    }
  }

  cancelMoveNote = () => {
    this.setState({
      moving: false,
      destination: null
    });
  }

  cancelDeleteNote = () => {
    this.setState({ deleting: false });
  }

  confirmDelete = () => {
    this.setState({
      deleting: true,
      moving: false,
      destination: null
    });
  }

  deleteNote = () => {
    quip.apps.getRootRecord().deleteNote(this.props.note);
  }

  formatAndCleanTopics = () => {
    let topics = this.state.topics.split(' ');
    topics = topics.map(t => t.trim());
    topics = topics.map(t => (t[0] === '#') ? t.substring(1) : t);
    topics = topics.filter(t => t.length);
    return topics;
  }

  moveNoteToSection = () => {
    const destination = this.state.destination;
    this.props.note.set('section', destination);

    this.setState({
      moving: false,
      destination: null
    }, () => {
      this.props.filterNotesAgain();
    });
  }

  movingNote = () => {
    this.setState({
      moving: true,
      destination: null,
      deleting: false
    });
  }

  toggleAdvancedControls = () => {
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  updateNoteDestination = (event) => {
    const value = event.target.value;
    let updatedState = {};

    updatedState.destination = (value.length) ? value : null;
    this.setState(updatedState);
  }

  updateTopicsOnRecord = () => {
    this.props.note.set('topics', this.state.topics);
  }

  updateGlobalTopicsOnRecord = () => {
    const topics = this.formatAndCleanTopics();
    this.props.updateGlobalTopics(topics);
  }

  updateTopics = (event) => {
    const value = event.target.value;
    let updatedState = { topics: value };

    if (value.length > 2) {
      let topics = value.split(' ');
      topics = topics.map(t => t.trim());
      
      if (topics.length) {
        let last = topics.pop();
        let matchingTopics = [];

        if (last.length > 3) {
          // search for the string without the hash
          last = last.slice(1);

          let matchingTopics = this.context.topics.filter(t => {
            return t.toLowerCase().includes(last.toLowerCase());
          });
          
          if (matchingTopics.length > 4) {
            matchingTopics = matchingTopics.slice(0, 4);
          }

          updatedState.matchingTopics = matchingTopics;
        } else if (this.state.matchingTopics.length) {
          updatedState.matchingTopics = [];
        }
      }
    } else if (this.state.matchingTopics.length) {
      updatedState.matchingTopics = [];
    }

    this.setState(updatedState, this.updateTopicsOnRecord);
  }

  updateNoteFromRecord = (record) => {
    const section = record.get('section');
    const topics = record.get('topics');
    let updatedState = {};
    let update = false;

    if (section !== this.state.section) {
      updatedState.section = section;
      update = true;
    }

    if (topics !== this.state.topics) {
      updatedState.topics = topics;
      update = true;
    }

    if (update) {
      this.setState(updatedState);
    }
  }

  //////

  renderAdvancedControls = () => {
    let sectionSelecter;
    let deleteConfirmation;

    if (this.state.moving) {
      let options = this.context.sections
        .filter(s => s !== this.state.section)
        .map(s => <option value={s}>{s}</option>)
      
      sectionSelecter = <div className={Style.destination}>
        <select onChange={this.updateNoteDestination}>
          <option value="">-- choose a new section --</option>
          {options}
        </select>

        <button type="button" className={Button.primary} disabled={this.state.destination === null} onClick={this.moveNoteToSection}>move here</button>
        <button type="button" className={Button.simple} onClick={this.cancelMoveNote}>cancel</button>
      </div>;
    }

    if (this.state.deleting) {
      deleteConfirmation = <div className={Style.deleter}>
        <span>are you sure?</span>
        <button type="button" className={Button.simple} onClick={this.deleteNote}>delete</button>
        <button type="button" className={Button.primary} onClick={this.cancelDeleteNote}>cancel</button>
      </div>;
    }

    return <div className={Style.controls}>
      <button type="button" onClick={this.confirmDelete} className={Button.text}>
        <GarbageIcon /> delete this note
      </button>

      {deleteConfirmation}

      {!this.state.moving && (<button type="button" onClick={this.movingNote} className={Button.text}>
        move this note
      </button>)}

      {sectionSelecter}
    </div>;
  }

  renderSection = () => {
    return <label className={Form.stackedFormInput}>
      <span className={Form.label}>
        Section
      </span>

      <input type="text" value={this.state.section} disabled />
    </label>;
  }

  render() {
    const note = this.props.note;  
    let matchingTopics;
    let advancedControls;
    let sectionName;

    if (this.state.matchingTopics.length) {
      matchingTopics = <span className={Form.tagsYouMightWant}><em>maybe</em> {this.state.matchingTopics.join(', ')}?</span>;
    }

    if (this.state.showAdvanced) {
      advancedControls = this.renderAdvancedControls();
    }

    if (this.props.showSection) {
      sectionName = this.renderSection();
    }

    return <div key={note.getId()} className={Style.note}>
      <div className={Style.content}>
        <quip.apps.ui.RichTextBox 
            record={note.get('content')}
            allowedStyles={richTextAllowedStyles}
            maxListIndentationLevel="3"
            minHeight={50}
             />
       </div>
      
      <footer className={Style.footer}>
        <label className={Form.stackedFormInput}>
          <span className={Form.label}>
            topics
            {matchingTopics}
          </span>

          <input type="text" 
            onInput={this.updateTopics}
            onBlur={this.updateGlobalTopicsOnRecord}
            value={this.state.topics} 
            placeholder="#dataprivacy #ethics (start each tag with a #, separate with a space)" />
        </label>

        {sectionName}

        <div className={Style.advancedControls}>
          {advancedControls}
                  
          <div className={Style.toggle}>
            <button type="button" className={Button.superDiscreet} onClick={this.toggleAdvancedControls}>
              {this.state.showAdvanced ? 'hide advanced' : 'advanced controls'}
            </button>
          </div>
        </div>
      </footer>
    </div>;
  }
}

function GarbageIcon() {
  return <svg className={Style.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
}
