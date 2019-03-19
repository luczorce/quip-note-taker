import QuipCaller from '../util/quip-caller.js';
import Style from '../style/Form.less';

export default class TestButtons extends React.Component {
  static propTypes = {
    token: React.PropTypes.string
  };

  constructor(props) {
    super();

    this.docCaller = QuipCaller(props.token, quip.apps.getThreadId());
  }

  testDocumentGetter = () => {
    this.docCaller.getDocument().then(response => {
      console.log(response);
    });
  }

  render() {
    return <p>
      <button type="button" onClick={this.testDocumentGetter} className={Style.simple}>
        test document getter
      </button>
    </p>;
  }
}
