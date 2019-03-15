import Question from './Question.jsx';
import QuipCaller from '../util/quip-caller.js';
import Style from '../style/Form.less';
import Message from '../style/Message.less';

export default class NoteTaker extends React.Component {
  static propTypes = {
    token: React.PropTypes.string
  };

  constructor(props) {
    super();

    this.state = {
      thought: '',
      tags: '',
      showSavedMessage: false
    };

    this.thoughtElement = null;
    this.setThoughtElementRef = element => {
      this.thoughtElement = element;
    }

    this.docCaller = QuipCaller(props.token, quip.apps.getThreadId());

    quip.apps.updateToolbar({disabledCommandIds: []});
  }

  clearAndShiftFocus = () => {
    this.setState({
      thought: '',
      tags: ''
    });

    this.thoughtElement.focus();
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

    let topics = this.state.tags.split(',');
    topics = topics.map(t => t.trim());
    record.updateTopics(topics);
    
    let note = {
      content: this.state.thought,
      topics: topics,
      owner: quip.apps.getViewingUser().getId()
    };
    record.addNote(note);
    this.docCaller.updateDocument(note).then(response => {
      console.log(response);
    });

    this.indicateSaved();
    this.clearAndShiftFocus();

  }

  testDocumentGetter = () => {
    this.docCaller.getDocument().then(response => {
      console.log(response);
    });
  }

  updateTags = (event) => {
    this.setState({tags: event.target.value});
  }

  updateThought = (event) => {
    this.setState({thought: event.target.value});
  }

  render() {
    return <div className={Style.noteForm}>
      <label className={Style.stackedFormInput}>
        <span className={`${Style.label} ${Style.labelWithPopup}`}>
          current thought
          {this.state.showSavedMessage && <span className={Style.addSuccess}>saved!</span>}
        </span>
        
        <textarea className={Style.thoughtInput} onInput={this.updateThought} value={this.state.thought} rows="3" ref={this.setThoughtElementRef}></textarea>
      </label>

      <div className={Style.formRow}>
        <label className={Style.stackedFormInput}>
          <span className={Style.label}>tags</span>
          <input type="text" onInput={this.updateTags} value={this.state.tags} placeholder="example: blockchain, data privacy, ethics" />
        </label>

        <button type="button" onClick={this.saveThought} disabled={!this.state.thought.length} className={`${Style.buttonPrimary} ${Style.submitNote}`}>
          add
          <span className={Style.primedToAdd}>ready!</span>
        </button>

      </div>

      <p className={Message.helper}><Question/> add notes as you think them, and they'll be automatically sorted for you based on your tags.</p>
    </div>;
  }
}
