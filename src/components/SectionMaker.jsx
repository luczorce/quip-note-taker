import Question from './Question.jsx';
import Style from '../style/Form.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class SectionMaker extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    sectionCreated: React.PropTypes.func
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
    this.props.sectionCreated();
  }

  saveSection = (event) => {    
    const section = event.target.value;

    quip.apps.getRootRecord.appendSection(section);
    this.props.sectionCreated();
  }

  updateSectionName = (event) => {
    const name = event.target.value;
    this.setState({
      section: name,
      isValid: this.checkValidSectionName(name)
    });
  }

  render() {
    return <div className={Style.sectionForm}>
      <div className={Style.formRow}>
        <label className={Style.stackedFormInput}>
          <span className={Style.label}>section</span>

          <input type="text" 
              onInput={this.updateSectionName} 
              ref={this.setSectionInputRef}
              value={this.state.section} />
        </label>

        <button type="button" 
            onClick={this.saveSection} 
            disabled={!this.state.isValid}
            className={Button.buttonPrimary}>
          add
        </button>
        
        <button className={`${Button.buttonSimple} ${Button.windowCloser}`} type="button" onClick={this.closeMaker}>
          cancel
        </button>

      </div>

      <p className={Message.helper}><Question style={Message.icon}/> add sections like groups from slack</p>
    </div>;
  }
}
