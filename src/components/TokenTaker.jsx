import Style from '../style/Form.less';
import Message from '../style/Message.less'

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
      <p><code>TODO</code> instructions for how to find that key go here.</p>

      <label className={Style.stackedFormInput}>
        <span className={Style.label}>user token</span>
        <input type="text" value={this.state.tokenCandidate} onInput={this.updateCandidate} />
      </label>

      <p>        
        <button type="button" disabled={!this.state.tokenCandidate.length} className={Style.buttonPrimary} onClick={this.saveToken}>
          save token
        </button>
        &nbsp;
        {successMessage}
      </p>
    </div>;
  }
}
