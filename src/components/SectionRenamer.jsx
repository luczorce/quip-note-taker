import Style from '../style/Sections.less';
import Form from '../style/Form.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class SectionRenamer extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    section: React.PropTypes.string,
    finished: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      newName: props.section,
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
    name = name.trim();
    const isDuplicated = this.props.sections.includes(name);
    const isFilled = Boolean(name.length);
    const isSame = Boolean(name === this.props.section);
    return isFilled && !isDuplicated && !isSame;
  }

  closeRenamer = () => {
    this.props.finished(null);
  }

  renameSection = (event) => {
    const section = this.props.section;
    const name = this.state.newName.trim();
    
    quip.apps.getRootRecord().renameSection(section, name);
    this.props.finished({section, name});
  }

  updateNewName = (event) => {
    const name = event.target.value;
    this.setState({
      newName: name,
      isValid: this.checkValidSectionName(name)
    });
  }

  render() {
    return <div className={`${Style.form} ${Form.container}`}>
      <p className={Message.helper} style={{marginTop: 0}}><QuestionIcon /> rename a section</p>
      
      <div className={Form.formRow}>
        <label className={Form.rowQueen}>
          <span className={Form.label}>new name</span>

          <input type="text" 
              className={Form.textInput}
              onInput={this.updateNewName} 
              ref={this.setSectionInputRef}
              value={this.state.newName} />
        </label>

        <button type="button" 
            onClick={this.renameSection} 
            disabled={!this.state.isValid}
            className={Button.primary}>
          rename
        </button>
        
        <button className={Button.simple} type="button" onClick={this.closeRenamer}>
          cancel
        </button>
      </div>
    </div>;
  }
}

function QuestionIcon() {
  return <svg className={Message.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>;
}
