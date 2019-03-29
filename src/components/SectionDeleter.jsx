import Style from '../style/Sections.less';
import Form from '../style/Form.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class SectionDeleter extends React.Component {
  static propTypes = {
    section: React.PropTypes.string,
    sections: React.PropTypes.array,
    finished: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      childNotes: quip.apps.getRootRecord().getNotesFor(props.section),
      reassign: null
    };
  }

  // componentDidMount() {}

  close = () => {
    this.props.finished(false);
  }

  deleteSection = () => {
    quip.apps.getRootRecord().deleteSection(this.props.section);
    this.props.finished(true);
  }

  //////

  renderReassignment = () => {
    let options = this.props.section.filter(s => s !== this.props.section).map(s => {
      return <option value={s}>s</option>;
    });

    let count = `${this.state.childNotes.length} note`;
    if (this.state.childNotes.length !== 1) {
      count += 's';
    }

    return <label className={Form.rowQueen}>
      <span className={Form.label}>reassign {count} under:</span>

      <select onChange={e => this.setState({reassign: e.target.value})}>
        {options}
        </select>
    </label>;
  }

  render() {
    let notice, select;

    if (this.state.childNotes.length) {
      notice = <p className={Message.helper}><QuestionIcon /> reassign notes under this section to delete the section</p>;
      select = this.renderReassignment();
    }

    return <div className={`${Style.form} ${Form.container}`}>
      <p>Are you sure you want to delete the section <strong>{this.props.section}</strong>?</p>
      
      {notice}
      
      <div className={Form.formRow}>
        {select}

        <button type="button" 
            onClick={this.deleteSection} 
            disabled={this.state.childNotes.length && this.state.reassign === null}
            className={Button.primary}>
          delete
        </button>
        
        <button className={Button.simple} type="button" onClick={this.close}>
          cancel
        </button>
      </div>
    </div>;
  }
}

function QuestionIcon() {
  return <svg className={Message.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>;
}
