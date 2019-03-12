import TokenTaker from './components/TokenTaker.jsx';
import Styles from "./style/App.less";

export default class App extends React.Component {
  constructor(props) {
    super();

    const token = quip.apps.getUserPreferences().getForKey('token');
    
    this.state = {
      token: token,
      showTokenForm: (token === undefined || !token.length)
    };
    console.log(this.state);
  }

  tokenIsSet = (token) => {
    this.setState({
      token: token,
      showTokenForm: false
    });
  }

  render() {
    let content;
    
    if (this.state.showTokenForm) {
      content = <TokenTaker token={this.state.token} tokenSaved={this.tokenIsSet} />
    } else {
      content = <p>Hello, world!</p>;
    }
    
    return content;
  }
}
