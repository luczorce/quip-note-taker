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
    currentUser: React.PropTypes.string
  }

  recordListener = null;

  constructor(props) {
    super();

    const likes = props.note.get('likes');

    this.state = {
      topics: props.note.get('topics'),
      section: props.note.get('section'),
      likes: likes,
      usernames: {},
      matchingTopics: [],
      hasLiked: false,
      showAdvanced: false,
      deleting: false,
      moving: false,
      destination: null
    };
  }

  componentDidMount() {
    this.recordListener = this.props.note.listen(this.updateNoteFromRecord);
    this.setState({ hasLiked: this.state.likes.includes(this.context.currentUser) });
    
    // HACK not wrapped in the timeout, we can't find users (even though the quip user ids are VERY valid)
    window.setTimeout(this.getUsernames, 1);
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

  getUsernames = () => {
    let usernames = {};
    let update = false;

    this.props.note.get('likes').forEach(user => {  
      if (!this.state.usernames.hasOwnProperty(user)) {
        let quipUser = quip.apps.getUserById(user);
        
        if (quipUser !== null) {
          usernames[user] = quipUser.getName();
          update = true;
        }
      }
    });

    if (update) {
      this.setState({usernames: Object.assign(usernames, this.state.usernames)});
    }
  }

  likeToggle = () => {
    this.props.note.toggleLike(this.context.currentUser);
  }

  formatAndCleanTopics = () => {
    let topics = this.state.topics.split(' ');
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
    // set the note topics
    this.props.note.set('topics', this.state.topics);
    
    // update the global record topics
    // TODO figure this out. we are saving # and #h and #ha and so forth until #hashtagging
    // const topics = this.formatAndCleanTopics();
    // this.props.updateGlobalTopics(topics);
  }

  updateTopics = (event) => {
    const value = event.target.value;
    let updatedState = { topics: value };

    if (value.length > 2) {
      let topics = value.split(' ');
      topics = topics.map(t => t.trim());
      // tags = tags.filter(t => t.length);
      
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

    this.setState(updatedState, () => {
      this.updateTopicsOnRecord();
    });
  }

  updateNoteFromRecord = (record) => {
    const section = record.get('section');
    const topics = record.get('topics');
    const likes = record.get('likes');
    let updatedState = {};
    let update = false;
    let updateUsernames = false;

    if (section !== this.state.section) {
      updatedState.section = section;
      update = true;
    }

    if (topics !== this.state.topics) {
      updatedState.topics = topics;
      update = true;
    }

    if (likes !== this.state.likes) {
      updatedState.likes = likes;
      updatedState.hasLiked = likes.includes(this.context.currentUser);
      update = true;
      updateUsernames = true;
    }

    if (update) {
      this.setState(updatedState, () => {
        if (updateUsernames) {
          this.getUsernames();
        }
      });
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

  renderLikes = () => {
    let likeCount = this.state.likes.length;
    let likeList;
    let likeControl = (this.state.hasLiked) ? <FilledStarIcon action={this.likeToggle} /> : <EmptyStarIcon action={this.likeToggle} />;

    if (likeCount) {
      let names = this.state.likes.map(user => this.state.usernames[user]);
      
      if (names.length >= 2) {
        let last = names.pop();
        names = `${names.join(', ')}, and ${last}`;
      } else {
        names = names.join(', ')
      }

      likeList = `liked by ${names}`;
    }
    
    likeCount += (likeCount === 1) ? ' like' : ' likes';
    
    return <div className={Style.likes}>
      {likeControl} <span>{likeCount}</span> <em style={{fontSize: '0.9em'}}>{likeList}</em>
    </div>;
  }

  render() {
    const note = this.props.note;  
    let matchingTopics;
    let advancedControls;
    let sectionName;
    let likes = this.renderLikes();

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
          placeholder="#dataprivacy #ethics (start each tag with a #, separate with a space)" />
      </label>

      {sectionName}

      {likes}

      <div className={Style.advancedControls}>
        {advancedControls}
                
        <div className={Style.toggle}>
          <button type="button" className={Button.superDiscreet} onClick={this.toggleAdvancedControls}>
            {this.state.showAdvanced ? 'hide advanced' : 'advanced controls'}
          </button>
        </div>
      </div>
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
