import Styles from "./style/App.less";

export default class App extends React.Component {
  static propTypes = {
    userKey: React.PropTypes.string
  };

  render() {
    let content;

    if (this.props.userKey === undefined) {
      content = <p>Welcome! Please enter a user key to proceed</p>;
    } else {
      content = <p>Hello, world!</p>;
    }
    
    return content;
  }
}
