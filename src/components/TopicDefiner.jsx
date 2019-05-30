import { debounce } from 'throttle-debounce';
import Form from '../style/Form.less';
import Button from '../style/Buttons.less';

export default class TopicDefiner extends React.Component {
  static propTypes = {
    predefinedTopics: React.PropTypes.array,
    finished: React.PropTypes.func
  }

  constructor(props) {
    super();

    this.state = {
      topics: props.predefinedTopics.join('\n')
    };

    this.topicInput = null;
    this.setTopicInputRef = element => {
      this.topicInput = element;
    }
  }

  componentDidMount() {};

  leave = () => {
    this.props.finished();
  }

  saveTopics = () => {
    let topics = this.state.topics.split('\n');
    topics = topics.map(t => t = t.trim());
    
    quip.apps.getRootRecord().updateDefaultTopics(topics);
    this.props.finished()
  }

  updateTopics = (event) => {
    this.setState({topics: event.target.value});
  }

  render() {
    return <div className={Form.container}>
      <label className={Form.label}>Add default topics to use, one per line</label>
      <textarea
          className={Form.textarea}
          onInput={this.updateTopics} 
          value={this.state.topics}
          rows="5"
          ref={this.setTopicInputRef} />
      
      <button type="button" className={Button.simple} onClick={this.saveTopics}>save</button> &nbsp;
      <button type="button" className={Button.simple} onClick={this.leave}>cancel</button>
    </div>;
  }
}
