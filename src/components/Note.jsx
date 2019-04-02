import Style from '../style/Notes.less';
import Form from '../style/Form.less';
import Message from '../style/Message.less';
import Button from '../style/Buttons.less';
import {richTextAllowedStyles} from '../util/richtext-record-styles.js';

export default class Note extends React.Component {
  static propTypes = {
    // note is really the NoteRecord
    note: React.PropTypes.object,
    globalTopics: React.PropTypes.array,
    updateGlobalTopics: React.PropTypes.func,
    filterNotesAgain: React.PropTypes.func,
    showSection: React.PropTypes.bool
  };

  static contextTypes = {
    sections: React.PropTypes.array
  }

  recordListener = null;

  constructor(props) {
    super();

    this.state = {
      topics: props.note.get('topics').join(', '),
      section: props.note.get('section'),
      matchingTopics: [],
      showAdvanced: false,
      moving: false,
      destination: null
    };
  }

  componentDidMount() {
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

  confirmDelete = () => {
    // TODO
  }

  // likeNote = () => {
  //   const rootRecord = quip.apps.getRootRecord();
  //   rootRecord.toggleNoteLike(this.props.note.guid, quip.apps.getViewingUser().getId(), true);
  // }

  // unlikeNote = () => {
  //   const rootRecord = quip.apps.getRootRecord();
  //   rootRecord.toggleNoteLike(this.props.note.guid, quip.apps.getViewingUser().getId(), false);
  // }

  formatAndCleanTopics = () => {
    let topics = this.state.topics.split(',');
    topics = topics.map(t => t.trim());
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
      destination: null
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
    // const topics = this.formatAndCleanTopics();
    // this.props.note.set('topics', topics);
    // this.props.updateGlobalTopics(topics);
  }

  updateTopics = (event) => {
    const value = event.target.value;
    // let updatedState = { topics: value };
    let updatedState = {};

    if (value.length > 2) {
      let topics = value.split(',');
      topics = topics.map(t => t.trim());
      // tags = tags.filter(t => t.length);
      
      if (topics.length) {
        let last = topics.pop();
        let matchingTopics = [];

        if (last.length > 3) {
          // search for the string without the hash
          last = last.slice(1);

          let matchingTopics = this.props.globalTopics.filter(t => {
            return t.toLowerCase().includes(last.toLowerCase()) && t[0] === '#';
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

    this.setState(updatedState);
    this.updateTopicsOnRecord();
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

    return <div className={Style.controls}>
      <button type="button" onClick={this.confirmDelete} className={Button.text}>
        <GarbageIcon /> delete this note
      </button>

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

    // if (this.props.showSection) {
    // }
      sectionName = this.renderSection();

    // let likeCount = note.likes.length;
    // likeCount += (likeCount === 1) ? ' like' : ' likes';

    // let userLiked = note.likes.includes(quip.apps.getViewingUser().getId());
    // let likeControl = (userLiked) ? <FilledStarIcon action={this.unlikeNote} /> : <EmptyStarIcon action={this.likeNote} />;

    // let likeList = '';

    return <div key={note.getId()} className={Style.note}>
      <div className={Style.content}>
        <quip.apps.ui.RichTextBox 
            record={note.get('content')}
            allowedStyles={richTextAllowedStyles}
            maxListIndentationLevel="3"
            minHeight={200}
             />
       </div>
      
      <label className={Form.stackedFormInput}>
        <span className={Form.label}>
          topics
          {matchingTopics}
        </span>

        <input type="text" 
          onInput={this.updateTopics}
          value={this.state.topics} 
          placeholder="#data privacy, #ethics (each tag starts with #, separate tags with a comma)" />
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
      {/*<div className={Style.likes}>{likeControl} {likeCount} {likeList}</div>*/}
    </div>;
  }
}

function FilledStarIcon(params) {
  return <svg className={Style.icon} onClick={params.action} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#f1d860" stroke="#d2c41b" strokeWidth="3" strokelinecap="butt" strokelinejoin="arcs"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
}

function EmptyStarIcon(params) {
  return <svg className={Style.icon} onClick={params.action} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="3" strokelinecap="butt" strokelinejoin="arcs"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
}

function GarbageIcon() {
  return <svg className={Style.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
}
