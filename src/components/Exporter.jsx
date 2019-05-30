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

    this.state = {
      isReady: false
    };
  }

  componentDidMount() {}

  exportSection = () => {
    console.log('exporting');
  }

  render() {
    return <div className={`${Form.container} ${Form.floater}`}>
      <p className={Message.helper} style={{marginTop: 0}}><QuestionIcon /> export notes to <span style={{textDecoration: 'underline'}}>{(this.props.destination === 'quip' ? 'a new Quip document' : 'elsewhere')}</span></p>
      
      <div className={Form.formRow}>
        <label className={Form.rowQueen}>
          <span className={Form.label}>section name</span>

          <p>WHAT DOESKJHGSKJ HERE</p>
        </label>

        <button type="button" 
            onClick={this.exportSection} 
            disabled={!this.state.isReady}
            className={Button.primary}>
          export
        </button>
        
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
