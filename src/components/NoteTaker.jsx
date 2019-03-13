import Style from '../style/Form.less';
import Message from '../style/Message.less';

const Question = function() {
  return <svg className={Message.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>;
}

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
        <textarea className={Style.thoughtInput} onInput={this.updateThought} value={this.state.thought} rows="3"></textarea>
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
