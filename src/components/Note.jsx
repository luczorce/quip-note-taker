// import { debounce } from 'throttle-debounce';
import Style from '../style/Notes.less';
import Form from '../style/Form.less';
import Message from '../style/Message.less';
import {richTextAllowedStyles} from '../util/richtext-record-styles.js';

export default class Note extends React.Component {
  static propTypes = {
    // note is really the NoteRecord
    note: React.PropTypes.object,
    globalTopics: React.PropTypes.array,
    updateGlobalTopics: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      topics: props.note.get('topics').join(', '),
      matchingTopics: []
    };

  }

  // componentDidMount() {
    // this.updateTopicsOnRecord = debounce(200, this.updateTopicsOnRecord)
  // }

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

  updateTopicsOnRecord = () => {
    const topics = this.formatAndCleanTopics();
    this.props.note.set('topics', topics);
    this.props.updateGlobalTopics(topics);
  }

  updateTopics = (event) => {
    const value = event.target.value;
    let updatedState = { topics: value };

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
  }

  render() {
    const note = this.props.note;  
    let matchingTopics;

    if (this.state.matchingTopics.length) {
      matchingTopics = <span className={Form.tagsYouMightWant}><em>maybe</em> {this.state.matchingTopics.join(', ')}?</span>;
    } 
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
          onBlur={this.updateTopicsOnRecord}
          value={this.state.topics} 
          placeholder="#data privacy, #ethics (each tag starts with #, separate tags with a comma)" />
      </label>

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
