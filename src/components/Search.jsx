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
      isSearching: false
    };
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
      this.props.search('');
    });
  }

  enableSearch = () => {
    this.setState({ isSearching: true });
  }

  search = () => {
    this.props.search(this.state.searchTerm);
  }

  updateSearch = (event) => {
    this.setState({searchTerm: event.target.value});
    this.search();
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
          className={Form.textInput}
          onInput={this.updateSearch} 
          value={this.state.searchTerm} />
      <button type="button" className={Button.simple} onClick={this.clearSearch}>clear</button>
      <button type="button" disabled className={Button.simple}>export</button>
      <button type="button" className={Button.simple} onClick={this.disableSearch}><CloseSearchIcon title="collapse the search"/></button>
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