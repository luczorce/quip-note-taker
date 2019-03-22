import quip from "quip";
import App from "./App.jsx";

import { 
  NoteBookRecord, 
  NoteRecord, 
  NoteInProgressRecord } from './record.js';

quip.apps.registerClass(NoteBookRecord, 'notebook-record');
quip.apps.registerClass(NoteRecord, 'note-record');
quip.apps.registerClass(NoteInProgressRecord, 'note-in-progress-record');

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    let rootRecord = quip.apps.getRootRecord();

    const userId = quip.apps.getViewingUser().getId();    
    let noteInProgress = rootRecord.getNoteInProgress(userId);
    
    if (noteInProgress === undefined) {
      noteInProgress = rootRecord.addNoteInProgress(userId);
      noteInProgress = noteInProgress.get('thought');
    } else {
      noteInProgress = noteInProgress.thought;
    }

    ReactDOM.render(<App record={rootRecord} userThought={noteInProgress} />, rootNode);
  },
});
