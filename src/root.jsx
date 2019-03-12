import quip from "quip";
import App from "./App.jsx";

import { NoteBookRecord, NoteRecord } from './record.js';

quip.apps.registerClass(NoteBookRecord, 'notebook-record');
quip.apps.registerClass(NoteRecord, 'note-record');

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    ReactDOM.render(<App />, rootNode);
  },
});
