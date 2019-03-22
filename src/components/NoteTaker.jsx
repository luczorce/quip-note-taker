import Question from './Question.jsx';
import Style from '../style/Form.less';
import Button from '../style/Buttons.less';

const uuid = require('uuid/v1');
// NOTE these values are different than what the docs say
// also images are not available to be added?
// not even drag and drop works on it
// console.log(quip.apps.RichTextRecord.Style);
const richTextAllowedStyles = [
  0, // TEXT_PLAIN
  // 1, // TEXT_H1
  2, // TEXT_H2
  3, // TEXT_H3
  4, // TEXT_CODE
  5, // LIST_BULLET
  6, // LIST_NUMBERED
  // checklist markdown just returns like a bullet list
  // there's no way to differentiate it
  // 7, // LIST_CHECKLIST
  11, // IMAGE
  16, // TEXT_BLOCKQUOTE
  // 17, // TEXT_PULL_QUOTE
  // 18, // HORIZONTAL_RULE
];

export default class NoteTaker extends React.Component {
  static propTypes = {
    // thought really is a quip.apps.RichTextRecord,
    thought: React.PropTypes.object,
    currentSections: React.PropTypes.array
  };

  constructor(props) {
    super();

    this.state = {
      tags: '',
      emptyThought: props.thought.empty(),
      thoughtFocus: false,
      showSavedMessage: false,
      showHelpMessage: false
    };
  }

  componentDidMount() {
    this.props.thought.listenToContent(this.updateNoteValidity);
    this.updateNoteValidity(this.props.thought);
  }

  componentWillUnmount() {
    this.props.thought.unlistenToContent();
  }

  clearAndShiftFocus = () => {
    this.props.thought.replaceContent('');
    this.props.thought.focus();

    this.setState({
      emptyThought: true,
      tags: ''
    });
  }

  formatAndCleanTopics = () => {
    let topics = this.state.tags.split(',');
    topics = topics.map(t => t.trim());
    topics = topics.filter(t => t.length);
    topics.unshift(this.props.currentSections[0]);
    
    return topics;
  }
  
  indicateSaved = () => {
    this.setState({showSavedMessage: true}, () => {
      window.setTimeout(() => {
        this.setState({showSavedMessage: false})
      }, 3000);
    });
  }

  loseThoughtFocusStyle = () => {
    this.setState({thoughtFocus: false});
  }

  setThoughtFocusStyle = () => {
    this.setState({thoughtFocus: true});
  }

  saveThought = () =>{
    const record = quip.apps.getRootRecord();

    let topics = this.formatAndCleanTopics();
    record.updateTopics(topics);
    
    let note = {
      content: this.props.thought.getTextContent(),
      topics: topics,
      owner: quip.apps.getViewingUser().getId(),
      guid: uuid()
    };
    record.addNote(note);

    this.indicateSaved();
    this.clearAndShiftFocus();
  }

  toggleHelpMessage = () => {
    const current = this.state.showHelpMessage;

    this.setState({showHelpMessage: !current});
  }

  updateTags = (event) => {
    this.setState({tags: event.target.value});
  }

  updateNoteValidity = (record) => {
    // NOTE :insert scream emoji:
    // record.empty() returns false when it's empty
    // const recordEmpty = record.empty();
    
    const content = record.getTextContent();
    const recordEmpty = !content.length;

    if (recordEmpty && !this.state.emptyThought) {
      this.setState({emptyThought: true});
    } else if (!recordEmpty && this.state.emptyThought) {
      this.setState({emptyThought: false});
    }
  }

  render() {
    const noNoteTaking = (this.props.currentSections.length !== 1);
    let thoughtLabel;
    let thoughtStyle = Style.textarea;

    if (noNoteTaking) {
      thoughtLabel = 'select only one section to add a note';
    } else {
      thoughtLabel = <span><SmallNoteIcon/> current thought</span>;
    }

    if (this.state.thoughtFocus) {
      thoughtStyle += ` ${Style.focus}`;
    }

    return <div className={Style.noteForm}>
      <label className={Style.stackedFormInput}>
        <span className={`${Style.label} ${Style.labelWithPopup}`}>
          {thoughtLabel}
          
          {this.state.showSavedMessage && <span className={Style.addSuccess}>saved!</span>}
        </span>

        <quip.apps.ui.RichTextBox 
            record={this.props.thought}
            className={thoughtStyle}
            allowedStyles={richTextAllowedStyles}
            maxListIndentationLevel="3"
            scrollable="true"
            minHeight={70}
            maxHeight={70}
            onFocus={this.setThoughtFocusStyle}
            onBlur={this.loseThoughtFocusStyle} />
      </label>

      <div className={Style.formRow}>
        <label className={Style.stackedFormInput}>
          <span className={Style.label}>tags</span>
          <input type="text" onInput={this.updateTags} value={this.state.tags} placeholder="example: blockchain, data privacy, ethics" disabled={noNoteTaking}/>
        </label>

        <button type="button" onClick={this.saveThought} disabled={this.state.emptyThought || noNoteTaking} className={`${Button.primary} ${Style.submitNote}`}>
          add
          <span className={Style.primedToAdd}>ready!</span>
        </button>
      </div>

      <div className={Style.popoverQuestion}>
        <span onClick={this.toggleHelpMessage}><Question style={Style.icon}/></span>
      </div>

      { this.state.showHelpMessage && <p className={Style.popoverNote}>add notes as you think them, and they'll be automatically sorted for you based on your tags.</p> }
    </div>;
  }
}

function SmallNoteIcon() {
  return <svg className={Style.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c6470" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>;
}
