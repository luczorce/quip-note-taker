import SectionMaker from './SectionMaker.jsx';
import Style from '../style/Sections.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class Sections extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array
  };

  constructor(props) {
    super();

    this.state = {
      current: [],
      showSectionList: false,
      showSectionMaker: false
    };
  }

  toggleSectionList = () => {
    this.setState({showSectionList: !this.state.showSectionList});
  }

  toggleSectionMaker = () => {
    this.setState({showSectionMaker: !this.state.showSectionMaker});
  }

  //////

  renderCurrentTitle = () => {
    if (this.state.current.length === this.props.sections.length && this.props.sections.length) {
      return 'All Sections';
    } else if (!this.props.sections.length) {
      return '[No Sections Available]';
    } else {
      return this.state.current.join(', ');
    }
  }

  renderSectionList = () => {
    let ordered;

    if (this.props.sections.length) {
      ordered = this.props.sections.sort().map(section => {
        let itemClass = Style.section;
        
        if (this.props.currentSections.includes(section)) {
          itemClass += ' ' + Style.selected;
        }
        
        return <li
            className={itemClass}>
              {section}
            </li>;
      });

      ordered = <ul className={Style.list}>{ordered}</ul>;
    } else {
      ordered = <ul className={`${Style.list} ${Style.empty}`}><li>(no sections)</li></ul>;
    }

    return ordered;
  }

  render() {
    let current = this.renderCurrentTitle();
    let list;
    let maker;

    if (this.state.showSectionList) {
      list = this.renderSectionList();
    }

    if (this.state.showSectionMaker) {
      maker = <SectionMaker sections={this.props.sections} finished={this.toggleSectionMaker} />;
    }

    return <div className={Style.container}>
      <div className={Style.mainline}>
        <button type="button" onClick={this.toggleSectionList} className={Button.simple}>
          {this.state.showSectionList ? <UpIcon /> : <DownIcon />}
        </button>

        <h1 className={Style.title}>{current}</h1>
        
        <button type="button" onClick={this.toggleSectionMaker} className={Button.simple}>
          <AddPlusIcon />
        </button>
      </div>

      {list}
      {maker}
    </div>;
  }
}

function AddPlusIcon() {
  // return <svg className={Button.icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ebebeb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="arcs"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;

  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d0202" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M12 18v-6M9 15h6"/></svg>
}

function DownIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d0202" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M6 9l6 6 6-6"/></svg>
}

function UpIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d0202" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M18 15l-6-6-6 6"/></svg>
}
