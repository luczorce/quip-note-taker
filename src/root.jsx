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
    let scratchpad = rootRecord.getScratchpad(userId);
    
    if (scratchpad === undefined) {
      scratchpad = rootRecord.addScratchpad(userId);
      // scratchpad = scratchpad.get('thought');
    } else {
      scratchpad = scratchpad.thought;
    }

    ReactDOM.render(<App record={rootRecord} scratchpad={scratchpad} />, rootNode);
  },
});
