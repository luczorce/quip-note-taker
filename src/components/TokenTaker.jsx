import Style from '../style/Form.less';

export default class TokenTaker extends React.Component {
  static propTypes = {
    token: React.PropTypes.string,
    tokenSaved: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      tokenCandidate: (props.token === undefined) ? '' : token
    };
  }

  updateCandidate = (event) => {
    this.setState({tokenCandidate: event.target.value});
  }

  saveToken = () => {
    const preferences = quip.apps.getUserPreferences();
    
    preferences.save({token: this.state.tokenCandidate})
    this.props.tokenSaved(this.state.tokenCandidate);
  }

  render() {
    let welcome;

    if (this.props.token === undefined) {
      welcome = <p>Welcome! Please enter a user key to use the app.</p>
    } else {
      welcome = <p>Please enter a user key.</p>
    }

    return <form className={Style.tokenForm}>
      {welcome}
      <p><code>TODO</code> instructions for how to find that key go here.</p>

      <label className={Style.stackedFormInput}>
        <span className={Style.label}>user token</span>
        <input type="text" value={this.state.tokenCandidate} onInput={this.updateCandidate} />
      </label>

      <p>        
        <button type="submit" disabled={!this.state.tokenCandidate.length} className={Style.buttonPrimary}>
          save token
        </button>
      </p>
    </form>;
  }
}
