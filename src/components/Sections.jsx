import SectionMaker from './SectionMaker.jsx';
import Style from '../style/Sections.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class Sections extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    updateCurrent: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      current: (props.sections.length) ? [ props.sections.sort()[0] ]: [],
      showList: false,
      showMaker: false
    };
  }

  componentDidMount() {
    this.props.updateCurrent(this.state.current);
  }

  setCurrent = (event, channel) => {
    let current;
    let close = false;

    if (event.shiftKey) {
      // want to select multiple channels wooo
      if (this.state.current.includes(channel)) {
        current = this.state.current.filter(c => c !== channel);
      } else {
        current = this.state.current.concat(channel)
      }
    } else {
      current = [channel];
      close = true;
    }

    let updatedState = {current: current};

    if (close) {
      updatedState.showList = false;
    }

    this.setState(updatedState);
    this.props.updateCurrent(current);
  }

  toggleSectionList = () => {
    let updatedState = {
      showList: !this.state.showList
    };

    // will be showing the list, but the maker is showing
    if (!this.state.showList && this.state.showMaker) {
      updatedState.showMaker = false;
    }

    this.setState(updatedState);
  }

  toggleSectionMaker = (section) => {
    let updatedState = {
      showMaker: !this.state.showMaker
    };

    // will be showing the maker, but the list is showing
    if (!this.state.showMaker && this.state.showList) {
      updatedState.showList = false;
    }

    // will be hiding the maker, sent something back
    if (this.state.showMaker && section !== null) {
      // TODO will this interfere with the state getting updated in the App?
      updatedState.current = [section];
      this.props.updateCurrent([section]);
    }

    this.setState(updatedState);
  }

  //////

  renderCurrentTitle = () => {
    if (this.state.current.length === this.props.sections.length && this.props.sections.length && this.state.current.length !== 1) {
      return 'All Sections';
    } else if (!this.props.sections.length) {
      return '[No Sections Available]';
    } else {
      return this.state.current.join(', ');
    }
  }

  renderHeader = () => {
    let current = this.renderCurrentTitle();

    return <div className={Style.mainline}>
      <button type="button" onClick={this.toggleSectionList} className={Button.simple}>
        {this.state.showList ? <UpIcon /> : <DownIcon />}
      </button>

      <h1 className={Style.title}>{current}</h1>
      
      <button type="button" onClick={e => this.toggleSectionMaker(null)} className={Button.simple}>
        <AddPlusIcon />
      </button>
    </div>;
  }

  renderSectionList = () => {
    let ordered;

    if (this.props.sections.length) {
      ordered = this.props.sections.sort().map(section => {
        let itemClass = Style.section;
        
        if (this.state.current.includes(section)) {
          itemClass += ' ' + Style.selected;
        }
        
        return <li
            className={itemClass}
            onClick={(e) => this.setCurrent(e, section)}>
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
    let header, list, maker;

    header = this.renderHeader();

    if (this.state.showList) {
      list = this.renderSectionList();
    }

    if (this.state.showMaker) {
      maker = <SectionMaker sections={this.props.sections} finished={this.toggleSectionMaker} />;
    }

    return <div className={Style.container}>
      {header}
      {list}
      {maker}
    </div>;
  }
}

function AddPlusIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M12 18v-6M9 15h6"/></svg>
}

function DownIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M6 9l6 6 6-6"/></svg>
}

function UpIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M18 15l-6-6-6 6"/></svg>
}
