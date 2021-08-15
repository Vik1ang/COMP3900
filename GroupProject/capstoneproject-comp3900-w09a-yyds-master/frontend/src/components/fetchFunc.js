export default async function FetchFunc (path, method, token, body) {
  return await fetch('http://localhost:8080/' + path, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'token': token,
    },
    body: body
  })
    .catch(err => console.warn(err))
}
// Authorization: 'Bearer ' + token