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

  close = () => {
    this.props.finished(false);
  }

  deleteSection = () => {
    const record = quip.apps.getRootRecord();
    
    if (this.state.childNotes.length) {
      this.state.childNotes.forEach(n => n.set('section', this.state.reassign));
    }
    
    record.deleteSection(this.props.section);
    this.props.finished(true);
  }

  updateReassignment = (event) => {
    const value = event.target.value;
    const update = (value.length) ? value : null;
    this.setState({reassign: update})
  }

  //////

  renderReassignment = () => {
    let options = this.props.sections.filter(s => s !== this.props.section).map(s => {
      return <option value={s}>{s}</option>;
    });

    let count = `${this.state.childNotes.length} note`;
    if (this.state.childNotes.length !== 1) {
      count += 's';
    }

    return <label className={Form.rowQueen}>
      <span className={Form.label}>reassign {count} under:</span>

      <select className={Form.select} 
              onChange={this.updateReassignment}>
        <option value="">-- choose a section --</option>
        {options}
        </select>
    </label>;
  }

  render() {
    let notice, select;

    if (this.state.childNotes.length) {
      notice = <p className={Message.helper}><WarningIcon /> reassign notes under this section to delete the section</p>;
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

function WarningIcon() {
  return <svg className={Message.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>
}
