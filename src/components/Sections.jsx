import Style from '../style/Sections.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class Sections extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    currentSections: React.PropTypes.array,
    showSectionMaker: React.PropTypes.func,
    updateCurrentSections: React.PropTypes.func
  };

  render() {
    let ordered;

    if (this.props.sections.length) {
      ordered = this.props.sections.sort().map(section => {
        let itemClass = Style.section;
        
        if (this.props.currentSections.includes(section)) {
          itemClass += ' ' + Style.selected;
        }
        
        return <li 
            onClick={() => this.props.updateCurrentSections(section)} 
            className={itemClass}>
              {section}
            </li>;
      });

      ordered = <ul className={Style.sectionList}>{ordered}</ul>;
    } else {
      ordered = <p>add a section to get started</p>;
    }

    return <div className={Style.sectionContainer}>
      {ordered}
      
      <div>
        <button type="button" onClick={this.props.showSectionMaker} className={Button.buttonSimple}>add new section</button>
      </div>
    </div>;
  }
}
