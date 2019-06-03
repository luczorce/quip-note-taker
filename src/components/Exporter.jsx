import Form from '../style/Form.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class Exporter extends React.Component {
  static propTypes = {
    destination: React.PropTypes.string,
    finished: React.PropTypes.func
  };

  constructor(props) {
    super();

    const token = quip.apps.getUserPreferences().getForKey('token');

    this.state = {
      isReady: false,
      quipToken: token || '',
      exportChoice: null
    };
  }

  componentDidMount() {}

  checkValidity = () => {
    const hasToken = this.state.quipToken.length;
    const hasChosenNotes = this.state.exportChoice !== null;

    this.setState({isReady: hasToken && hasChosenNotes});
  }

  exportSection = () => {
    console.log('not exporting');
    console.log('only testing the validity of the token right now');

    const tokenUrl = 'https://platform.quip.com/1/oauth/verify_token'
    fetch(tokenUrl, {
      headers: { 'Authorization': `Bearer ${this.state.quipToken}`}
    }).then(response => console.log(response))
  }

  updateQuipToken = (event) => {
    const token = event.target.value;

    this.setState({quipToken: token}, () => {
      quip.apps.getUserPreferences().save({token});
      this.checkValidity();
    });
  }

  updateWhichNotesToExport = (event) => {
    const target = event.target.value;

    this.setState({exportChoice: target}, this.checkValidity);
  }

  render() {
    const destination = (this.props.destination === 'quip') ? 'a new Quip document' : 'elsewhere';

    return <div className={`${Form.container} ${Form.floater}`}>
      <p className={Message.helper} style={{marginTop: 0}}><QuestionIcon /> export notes to <span style={{textDecoration: 'underline'}}>{destination}</span></p>

      <div className={Form.formRow}>
        <p className={Form.label}>Export which...</p>

        <label>
          <input type="radio" name="quipExport" value="all" className={Form.radio} onChange={this.updateWhichNotesToExport} />
          &nbsp; All Notes
        </label>

        <label>
          <input type="radio" name="quipExport" value="search" className={Form.radio} onChange={this.updateWhichNotesToExport} />
          &nbsp; Search Results
        </label>

        <label>
          <input type="radio" name="quipExport" value="section" className={Form.radio} onChange={this.updateWhichNotesToExport} />
          &nbsp; Current Section
        </label>
      </div>

      <p><em>In order to export to a Quip Document, we'll need your Quip Token, which you can get at the Quip Token Generator, accessible at <span style={{textDecoration: 'underline'}}>https://quip.com/dev/token</span>.</em></p>

      <div className={Form.formRow}>
        <label>
          <span className={Form.label}>Quip Token</span>
          <input type="text" value={this.state.quipToken} onInput={this.updateQuipToken} className={[Form.textInput, Form.monospace].join(' ')} />
        </label>
      </div>

      <div style={{marginTop: '10px'}}>
        <button type="button" 
            onClick={this.exportSection} 
            disabled={!this.state.isReady}
            className={Button.primary}>
          export
        </button>
        &nbsp;
        <button className={Button.simple} type="button" onClick={this.props.finished}>
          cancel
        </button>
      </div>
    </div>;
  }
}

function QuestionIcon() {
  return <svg className={Message.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>;
}
