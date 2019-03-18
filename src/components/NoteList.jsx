import Style from '../style/Form.less';
import Message from '../style/Message.less';

export default class NoteTaker extends React.Component {
  static propTypes = {
    notes: React.PropTypes.array,
    currentSection= React.PropTypes.string
  };

  // constructor(props) {
  //   super();
  // }

  render() {
    const currentNotes = this.state.notes.filter(n => n.topics.includes(this.state.currentSection));
    
    const notes = currentNotes.reverse.forEach((n, index) => {
      return <div key={index}
    });

    return <div>{notes}</div>;
  }
}
