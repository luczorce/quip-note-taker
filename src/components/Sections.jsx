import SectionMaker from './SectionMaker.jsx';
import SectionDeleter from './SectionDeleter.jsx';
import SectionRenamer from './SectionRenamer.jsx';
import Style from '../style/Sections.less';
import Button from '../style/Buttons.less';
import Message from '../style/Message.less';

export default class Sections extends React.Component {
  static propTypes = {
    sections: React.PropTypes.array,
    noteCount: React.PropTypes.object,
    updateCurrent: React.PropTypes.func
  };

  constructor(props) {
    super();

    this.state = {
      current: (props.sections.length) ? [ props.sections.sort()[0] ]: [],
      showList: false,
      showMaker: false,
      showDeleter: false,
      showRenamer: false,
      choppingBlock: '',
      updatingSection: null
    };
  }

  componentDidMount() {
    this.props.updateCurrent(this.state.current);
  }

  confirmDelete = (section) => {
    this.setState({
      showDeleter: true,
      choppingBlock: section,
      showList: false
    });
  }

  hideDelete = (didDeleteSection) => {
    let updatedState = {
      showDeleter: false,
      choppingBlock: ''
    };

    if (didDeleteSection && this.state.current.includes(this.state.choppingBlock)) {
      if (this.state.current.length === 1) {
        const place = this.props.sections.indexOf(this.state.choppingBlock);

        if (place - 1 === -1) {
          updatedState.current = [ this.props.sections[1] ]
          if (this.props.sections.length === 1) {
            updatedState.current = [];
          } else {
            updatedState.current = [ this.props.sections[1] ];
          }
        } else {
          updatedState.current = [ this.props.sections[place - 1] ];
        }
      } else {
        updatedState.current = this.state.current.filter(c => c !== this.state.choppingBlock);
      }

      this.props.updateCurrent(updatedState.current);
    }

    this.setState(updatedState);
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
      updatedState.current = [section];
      this.props.updateCurrent([section]);
    }

    this.setState(updatedState);
  }

  toggleSectionRenamer = (section) => {
    let updatedState = {
      showRenamer: !this.state.showRenamer
    };

    // will be showing the renamer
    if (!this.state.showRenamer) {
      updatedState.updatingSection = section;
      
      // is the list is showing?
      if (this.state.showList) {
        updatedState.showList = false;
      }
    }

    // will be hiding the maker
    if (this.state.showRenamer) {
      updatedState.showList = true;
      updatedState.updatingSection = null;

      // if we have a new section name
      if (section !== null && this.state.current.includes(section.section)) {
        const position = this.state.current.indexOf(section.section);
        let updatedCurrentSections = this.state.current;
        updatedCurrentSections.splice(position, 1, section.name);
        
        updatedState.current = updatedCurrentSections;
        this.props.updateCurrent(updatedCurrentSections);
      }
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
      <button type="button" onClick={this.toggleSectionList} className={[Button.discreet, Style.listToggle].join(' ')}>
        {this.state.showList ? <UpIcon /> : <DownIcon />}
      </button>

      <span className={[Style.listHelper, Message.titlePopover].join(' ')}>show section list</span>

      <h1 className={Style.title} onClick={this.toggleSectionList}>{current}</h1>

      <button type="button" onClick={e => this.toggleSectionMaker(null)} className={[Button.simple, Style.makerToggle].join(' ')}>
        <AddPlusIcon />
      </button>

      <span className={[Style.makerHelper, Message.titlePopover].join(' ')}>make new sections</span>
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
        
        return <li className={itemClass}>
          <button className={[Button.text, Style.name].join(' ')} onClick={(e) => this.setCurrent(e, section)}>{section} ({this.props.noteCount[section]})</button>

          <button className={Button.superDiscreet} type="button" title={['rename',section].join(' ')} onClick={e => this.toggleSectionRenamer(section)}>rename</button>

          <button className={Button.discreet} type="button" title={['delete',section].join(' ')} onClick={e => this.confirmDelete(section)}>
            <GarbageIcon />
          </button>
        </li>;
      });

      ordered = <ul className={Style.list}>{ordered}</ul>;
    } else {
      ordered = <ul className={`${Style.list} ${Style.empty}`}><li>(no sections)</li></ul>;
    }

    return ordered;
  }

  render() {
    let header, list, maker, deleter, renamer;

    header = this.renderHeader();

    if (this.state.showList) {
      list = this.renderSectionList();
    }

    if (this.state.showMaker) {
      maker = <SectionMaker sections={this.props.sections} finished={this.toggleSectionMaker} />;
    }

    if (this.state.showDeleter) {
      deleter = <SectionDeleter sections={this.props.sections} section={this.state.choppingBlock} finished={this.hideDelete} />
    }

    if (this.state.showRenamer) {
      renamer = <SectionRenamer sections={this.props.sections} section={this.state.updatingSection} finished={this.toggleSectionRenamer} />;
    }

    return <div className={Style.container}>
      {header}
      {list}
      {deleter}
      {maker}
      {renamer}
    </div>;
  }
}

function AddPlusIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M12 18v-6M9 15h6"/></svg>
}

function DeleteMinusIcon() {
  return <svg title="Delete this section" className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}

function DownIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M6 9l6 6 6-6"/></svg>
}

function UpIcon() {
  return <svg className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M18 15l-6-6-6 6"/></svg>
}

function GarbageIcon() {
  return <svg title="Delete this section" className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
}
