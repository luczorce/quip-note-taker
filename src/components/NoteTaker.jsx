import Style from '../style/Form.less';
import Message from '../style/Message.less'

export default class NoteTaker extends React.Component {
  // static propTypes = {
  //   token: React.PropTypes.string,
  //   tokenSaved: React.PropTypes.func
  // };

  constructor(props) {
    super();

    this.state = {
      thought: '',
      tags: ''
    };

    quip.apps.updateToolbar({disabledCommandIds: []});
  }

  saveThought = () =>{
    console.log('TODO will save the thought');
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
        <span className={Style.label}>current thought</span>
        <textarea className={Style.thoughtInput} onInput={this.updateThought} value={this.state.thought}></textarea>
      </label>

      <div className={Style.formRow}>
        <label className={Style.stackedFormInput}>
          <span className={Style.label}>tags</span>
          <input type="text" onInput={this.updateTags} value={this.state.tags} />
        </label>

        <button type="button" onClick={this.saveThought} disabled={!this.state.thought.length} className={`${Style.buttonSimple} ${Style.submitNote}`}>
          add
        </button>
      </div>
    </div>;
  }
}
