import Style from '../style/Sections.less';
import Message from '../style/Message.less';

export default class Sections extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    currentSections: React.PropTypes.array,
    showSectionMaker: React.PropTypes.func,
    updateCurrentSections: React.PropTypes.func
  };

  render() {
    console.log(this.props.currentSections);
    let ordered;

    if (this.props.sections.length) {
      ordered = this.props.sections.sort().map(section => {
        console.log(section);
        const itemClass = (this.props.currentSections.includes(section)) ? Style.selected : '';
        
        return <li 
            onClick={() => this.props.updateCurrentSections(section)} 
            className={itemClass}>
              {section}
            </li>;
      });

      ordered = <ul>{ordered}</ul>;
    } else {
      ordered = <p>add a section to get started</p>;
    }

    return <div>
      {ordered}
      
      <div>
        <button type="button" onClick={this.props.showSectionMaker}>add new section</button>
      </div>
    </div>;
  }
}
