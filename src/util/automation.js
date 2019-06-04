export const makeNewDocument = (token, content, title) => {
  const url = 'https://qetl-notetaker-proxy.herokuapp.com/exportToQuip';
  let data = new FormData();
  
  data.append('content', content);
  data.append('token', token);
  data.append('title', title);
  
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      // NOTE It helps to _not_ include this!?
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  });
};
