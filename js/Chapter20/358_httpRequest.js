const { request } = require('http');

// let options = {
//   hostname: 'eloquentjavascript.net',
//   path: '/20_node.html',
//   method: 'GET',
//   headers: { Accept: 'text/html' }
// };

// let requestStream = request(options, response => {
//   // console.log(`The server responded with status code: ${response.statusCode}`);
//   response.on('data', chunk => {
//     console.log(`BODY: ${chunk}`);
//   });
// });

// requestStream.end();

/* ======================================================================================================== */

let options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts/1',
  method: 'GET'
};

let requestStream = request(options, res => {
  res.setEncoding('utf8');
  res.on('data', data => {
    // console.log(`BODY: ${data}`);
    console.log(data);
  });
});

requestStream.on('error', err => console.log(err));

requestStream.end();
