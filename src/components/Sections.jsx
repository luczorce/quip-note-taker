import Style from '../style/Sections.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class Sections extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    currentSections: React.PropTypes.array,
    showSectionMaker: React.PropTypes.func,
    update: React.PropTypes.func,
    addAll: React.PropTypes.func,
    removeAll: React.PropTypes.func
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
            onClick={() => this.props.update(section)} 
            className={itemClass}>
              {section}
            </li>;
      });

      ordered = <ul className={Style.sectionList}>{ordered}</ul>;
    } else {
      ordered = <p><em>(empty)</em></p>;
    }

    return <div className={Style.sectionContainer}>
      <div>
        <h1 className={Style.title}>
          <svg className={Style.icon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ebebeb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="arcs"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg>
          &nbsp; Sections
        </h1>
        
        <p style={{fontSize: '0.9em'}}>select: 
          <button type="button" onClick={this.props.addAll} className={Button.discreetForDark}>all</button>
          <button type="button" onClick={this.props.removeAll} className={Button.discreetForDark}>none</button>
        </p>

        {ordered}
      </div>
      
      <div>
        <button type="button" onClick={this.props.showSectionMaker} className={`${Button.discreetForDark} ${Button.iconButton}`}>
          <svg className={Button.icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ebebeb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <span>add new section</span>
        </button>
      </div>
    </div>;
  }
}
