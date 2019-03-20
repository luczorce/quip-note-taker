import Question from './Question.jsx';
import Style from '../style/Form.less';
import Button from '../style/Buttons.less';

const uuid = require('uuid/v1');

export default class NoteTaker extends React.Component {
  static propTypes = {
    currentSections: React.PropTypes.array
  };

  constructor(props) {
    super();

    this.state = {
      thought: '',
      tags: '',
      showSavedMessage: false,
      showHelpMessage: false,
      collapse: Boolean(props.currentSections.length !== 1)
    };

    this.thoughtElement = null;
    this.setThoughtElementRef = element => {
      this.thoughtElement = element;
    }
  }

  clearAndShiftFocus = () => {
    this.setState({
      thought: '',
      tags: ''
    });

    this.thoughtElement.focus();
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

  saveThought = () =>{
    const record = quip.apps.getRootRecord();

    let topics = this.formatAndCleanTopics();
    record.updateTopics(topics);
    
    let note = {
      content: this.state.thought,
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

  updateThought = (event) => {
    this.setState({thought: event.target.value});
  }

  render() {
    const noNoteTaking = (this.props.currentSections.length !== 1);

    return <div className={Style.noteForm}>
      <label className={Style.stackedFormInput}>
        <span className={`${Style.label} ${Style.labelWithPopup}`}>
          {noNoteTaking ? 'select only one section to add a note' : 'current thought' }
          {this.state.showSavedMessage && <span className={Style.addSuccess}>saved!</span>}
        </span>
        
        <textarea className={Style.thoughtInput} onInput={this.updateThought} value={this.state.thought} rows="3" ref={this.setThoughtElementRef} disabled={noNoteTaking}></textarea>
      </label>

      <div className={Style.formRow}>
        <label className={Style.stackedFormInput}>
          <span className={Style.label}>tags</span>
          <input type="text" onInput={this.updateTags} value={this.state.tags} placeholder="example: blockchain, data privacy, ethics" disabled={noNoteTaking}/>
        </label>

        <button type="button" onClick={this.saveThought} disabled={!this.state.thought.length || noNoteTaking} className={`${Button.primary} ${Style.submitNote}`}>
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
