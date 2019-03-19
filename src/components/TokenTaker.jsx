import Question from './Question.jsx';
import Style from '../style/Form.less';
import Message from '../style/Message.less';

export default class TokenTaker extends React.Component {
  static propTypes = {
    token: React.PropTypes.string,
    tokenSaved: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      updated: false,
      tokenCandidate: (props.token === undefined) ? '' : props.token
    };

    quip.apps.updateToolbar({disabledCommandIds: ['updateToken']});
  }

  updateCandidate = (event) => {
    this.setState({tokenCandidate: event.target.value});
  }

  saveToken = () => {
    const preferences = quip.apps.getUserPreferences();
    
    preferences.save({token: this.state.tokenCandidate});

    this.setState({updated: true}, () => {
      window.setTimeout(() => {
        this.props.tokenSaved(this.state.tokenCandidate);
      }, 3000);
    });
  }

  render() {
    let welcome, successMessage;

    if (this.props.token === undefined) {
      welcome = <p>Welcome! Please enter a user key to use the app.</p>
    } else {
      welcome = <p>Please enter a user key.</p>
    }

    if (this.state.updated) {
      successMessage = <span className={Message.success}>token was successfully saved.</span>;
    }

    return <div className={Style.tokenForm}>
      {welcome}
      <p className={Message.instruction}><Question /> To find your user key, visit the <a href="https://quip.com/dev/token" target="_blank">quip dev token page</a></p>

      <label className={Style.stackedFormInput}>
        <span className={Style.label}>user key</span>
        <input type="text" value={this.state.tokenCandidate} onInput={this.updateCandidate} />
      </label>

      <p>
        <button type="button" disabled={!this.state.tokenCandidate.length} className={Style.primary} onClick={this.saveToken}>
          save token
        </button>

        &nbsp;

        <button type="button" disabled={!this.state.tokenCandidate.length} className={Style.simple} onClick={() => this.props.tokenSaved(this.state.tokenCandidate)}>
          never mind
        </button>

        &nbsp;
        {successMessage}
      </p>
    </div>;
  }
}
