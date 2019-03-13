import TokenTaker from './components/TokenTaker.jsx';
import NoteTaker from './components/NoteTaker.jsx';
import Styles from "./style/App.less";

export default class App extends React.Component {
  constructor(props) {
    super();

    const token = quip.apps.getUserPreferences().getForKey('token');
    
    this.state = {
      token: token,
      showTokenForm: (token === undefined || !token.length)
    };

    this.setMenu();
  }

  tokenIsSet = (token) => {
    this.setState({
      token: token,
      showTokenForm: false
    });
  }

  setMenu = () => {
    let toolbar = {
      toolbarCommandIds: [ 'updateToken' ],
      menuCommands: [
        {
          id: 'updateToken',
          label: 'update user key',
          handler: () => this.setState({showTokenForm: true}) 
        }
      ]
    };

    quip.apps.updateToolbar(toolbar);
  }

  render() {
    let content;
    
    if (this.state.showTokenForm) {
      content = <TokenTaker token={this.state.token} tokenSaved={this.tokenIsSet} />
    } else {
      content = <NoteTaker token={this.state.token} />;
    }
    
    return content;
  }
}
