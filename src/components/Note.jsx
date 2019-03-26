import ReactHtmlParser from 'react-html-parser';
import mdRender from '../util/markdown-renderer.js';
import Style from '../style/Notes.less';
import Message from '../style/Message.less';

export default class NoteList extends React.Component {
  static propTypes = {
    note: React.PropTypes.object, // reflects the NoteRecord
    name: React.PropTypes.string,
    likeNames: React.PropTypes.array,
    multipleSections: React.PropTypes.bool
  };

  likeNote = () => {
    console.log('wanna like this note');
  }

  unlikeNote = () => {
    console.log('wanna unlike this terrible thing');
  }

  render() {
    const note = this.props.note;

    let topics = note.topics.map(t => {
      if (t[0] === '#') {
        return <span className={Style.noteTopic}>{t}</span>;
      } else if (this.props.multipleSections) {
        return <span className={Style.noteSection}>{t}</span>;
      }
    });
    
    let content = mdRender(note.content);
    content = ReactHtmlParser(content);

    let likeCount = note.likes.length;
    likeCount += (likeCount === 1) ? ' like' : ' likes';

    let userLiked = note.likes.includes(quip.apps.getViewingUser().getId());
    let likeControl = (userLiked) ? <FilledStarIcon action={this.unlikeNote} /> : <EmptyStarIcon action={this.likeNote} />;

    let likeList = '';


    return <div key={note.guid} className={Style.note}>
      <p className={Style.owner}>{this.props.name}</p>
      <div className={Style.content}>{content}</div>
      <div className={Style.topicList}>{topics}</div>
      <div className={Style.likes}>{likeControl} {likeCount} {likeList}</div>
    </div>;
  }
}

function FilledStarIcon(params) {
  return <svg className={Style.icon} onClick={params.action} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#f1d860" stroke="#d2c41b" strokeWidth="3" strokelinecap="butt" strokelinejoin="arcs"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
}

function EmptyStarIcon(params) {
  return <svg className={Style.icon} onClick={params.action} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dadcdf" strokeWidth="3" strokelinecap="butt" strokelinejoin="arcs"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
}
