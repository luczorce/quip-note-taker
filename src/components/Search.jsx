import { debounce } from 'throttle-debounce';
import Style from '../style/Search.less';
import Form from '../style/Form.less';
import Button from '../style/Buttons.less';

export default class Search extends React.Component {
  static propTypes = {
    search: React.PropTypes.func,
  }

  constructor(props) {
    super();

    this.state = {
      searchTerm: '',
      isSearching: false,
      checkTopics: true,
      checkContent: false
    };

    this.searchInput = null;
    this.setSearchInputRef = element => {
      this.searchInput = element;
    }
  }

  componentDidMount() {
    this.search = debounce(300, this.search);
  }

  clearSearch = () => {
    this.setState({ searchTerm: '' });
  }

  disableSearch = () => {
    this.setState({
      isSearching: false,
      searchTerm: ''
    }, () => {
      this.props.search(null);
    });
  }

  enableSearch = () => {
    this.props.search('');
    this.setState({ isSearching: true }, () => {
      this.searchInput.focus();
    });
  }

  search = () => {
    this.props.search(this.state.searchTerm, this.state.checkTopics, this.state.checkContent);
  }

  immediateSearch = () => {
    this.props.search(this.state.searchTerm, this.state.checkTopics, this.state.checkContent);
  }

  updateSearch = (event) => {
    this.setState({searchTerm: event.target.value});
    this.search();
  }

  updateFilterByTopic = (event) => {
    this.setState({checkTopics: !this.state.checkTopics}, this.immediateSearch);
  }

  updateFilterByContent = (event) => {
    this.setState({checkContent: !this.state.checkContent}, this.immediateSearch);
  }

  //////

  renderClosedSearch = () => {
    return <div className={Style.inside}>
      <button type="button" className={Button.simple} onClick={this.enableSearch}><SearchIcon title="start searching"/></button>
    </div>;
  }

  renderOpenSearch = () => {
    return <div className={Style.inside}>
      <input type="text" 
          className={`${Form.textInput} ${Style.search}`}
          onInput={this.updateSearch} 
          value={this.state.searchTerm}
          ref={this.setSearchInputRef} />
      <button type="button" className={Button.simple} onClick={this.clearSearch}>clear</button>
      <button type="button" disabled className={Button.simple}>export</button>
      <button type="button" className={Button.simple} onClick={this.disableSearch}><CloseSearchIcon title="collapse the search"/></button>

      <p className={Style.filters}>
        <span>filter by: </span>
        
        <Checkbox label="topics" model={this.state.checkTopics} updater={this.updateFilterByTopic} />
        <Checkbox label="content" model={this.state.checkContent} updater={this.updateFilterByContent} />
      </p>
    </div>;
  }

  render() {
    const content = (this.state.isSearching) ? this.renderOpenSearch() : this.renderClosedSearch();
    let className = Style.search;

    if (this.state.isSearching) {
      className += ' ' + Style.open;
    } else {
      className += ' ' + Style.closed;
    }

    return <div className={className}>
      {content}
    </div>;
  }
}

function SearchIcon(params) {
  return <svg title={params.title} className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
}

function CloseSearchIcon(params) {
  return <svg title={params.title} className={Button.justIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="arcs"><path d="M9 18l6-6-6-6"/></svg>
}

function Checkbox(params) {
  return <label className={Style.option}>
    <input className={`${Form.checkbox} ${Style.optionbox}`} 
           type="checkbox" 
           checked={params.model} 
           onChange={params.updater} />
    <span>{params.label}</span>
  </label>;
}