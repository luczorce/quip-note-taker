import quip from "quip";
import App from "./App.jsx";
import reset from './style/quip-reset.css';

import { 
  NoteBookRecord, 
  NoteRecord } from './record.js';

quip.apps.registerClass(NoteBookRecord, 'notebook-record');
quip.apps.registerClass(NoteRecord, 'note-record');

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    let rootRecord = quip.apps.getRootRecord();

    ReactDOM.render(<App record={rootRecord} />, rootNode);
  },
});
