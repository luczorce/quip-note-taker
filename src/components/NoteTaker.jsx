import Style from '../style/Form.less';
import Message from '../style/Message.less'

export default class NoteTaker extends React.Component {
  // static propTypes = {
  //   token: React.PropTypes.string,
  //   tokenSaved: React.PropTypes.func
  // };

  constructor(props) {
    super();

    this.state = {
      updated: false,
      tokenCandidate: (props.token === undefined) ? '' : props.token
    };

    quip.apps.updateToolbar({disabledCommandIds: []});
  }

  render() {
    return <div className={Style.noteForm}>
      <p>Hellow werld!</p>
    </div>;
  }
}
