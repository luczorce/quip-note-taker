export default function QuipCaller(token, threadId) {
  const USER_TOKEN = token;
  const THREAD = threadId;
  
  return {
    getDocument,
    updateDocument
  }

  //////
  
  function getDocument() {
    const path = `https://localhost:8000/doc/${THREAD}?token=${encodeURIComponent(USER_TOKEN)}`;
    const options = {
      method: 'GET'
    };
    
    return combinedFetch(path, options);
  }

  function updateDocument() {
    console.log('TODO');
  }
}

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
