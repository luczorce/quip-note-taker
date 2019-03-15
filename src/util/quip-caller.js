export default function QuipCaller(token, threadId) {
  const USER_TOKEN = token;
  const THREAD = threadId;
  const API = 'https://qetl-notetaker-proxy.herokuapp.com';
  // const API = 'https://localhost:8000';
  
  return {
    getDocument,
    updateDocument
  }

  //////
  
  function getDocument() {
    const path = `${API}/doc/${THREAD}?token=${encodeURIComponent(USER_TOKEN)}`;
    const options = {
      method: 'GET'
    };
    
    return combinedFetch(path, options);
  }

  function updateDocument(note) {
    const path = `${API}/doc/${THREAD}?token=${encodeURIComponent(USER_TOKEN)}`;
    const options = {
      method: 'POST',
      body: getFormatedQuipSection(note),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    
    return combinedFetch(path, options);
  }
}

//////

function combinedFetch(path, options) {
  let response;

  return new Promise((resolve, reject) => {
    fetch(path, options).then(resp => {
      response = resp;
      return (resp.status === 204) ? {} : resp.json();
    }).then(responseBody => {
      response.data = responseBody;
      resolve(response);
    });
  });
}

function getFormatedQuipSection(note) {
  let content = '';

  note.topics.forEach((n, index) => {
    if (index === 0) {
      content += `<h2>${n}</h2>`;
    } else {
      content += `<h3>${n}</h3>`;
    }
  });

  content += `<p>${note.content}</p>`;

  return `content=${content}`;
}