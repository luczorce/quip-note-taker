import Style from '../style/Sections.less';
import Form from '../style/Form.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class SectionMaker extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    finished: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      section: '',
      isValid: false
    };

    this.sectionInput = null;
    this.setSectionInputRef = element => {
      this.sectionInput = element;
    }
  }

  componentDidMount() {
    this.sectionInput.focus();
  }

  checkValidSectionName = (name) => {
    const isDuplicated = this.props.sections.includes(name);
    const isFilled = Boolean(name.length);
    return isFilled && !isDuplicated;
  }

  closeMaker = () => {
    this.props.finished(null);
  }

  saveSection = (event) => {
    const section = this.state.section;
    
    quip.apps.getRootRecord().addSection(section);
    this.props.finished(section);
  }

  updateSectionName = (event) => {
    const name = event.target.value;
    this.setState({
      section: name,
      isValid: this.checkValidSectionName(name)
    });
  }

  render() {
    return <div className={`${Style.form} ${Form.container}`}>
      <p className={Message.helper}><QuestionIcon /> add sections like groups from slack</p>
      
      <div className={Form.formRow}>
        <label className={Form.rowQueen}>
          <span className={Form.label}>section name</span>

          <input type="text" 
              className={Form.textInput}
              onInput={this.updateSectionName} 
              ref={this.setSectionInputRef}
              value={this.state.section} />
        </label>

        <button type="button" 
            onClick={this.saveSection} 
            disabled={!this.state.isValid}
            className={Button.primary}>
          add
        </button>
        
        <button className={Button.simple} type="button" onClick={this.closeMaker}>
          cancel
        </button>
      </div>
    </div>;
  }
}

function QuestionIcon() {
  return <svg className={Message.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>;
}
