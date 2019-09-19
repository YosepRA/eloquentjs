const { createServer } = require('http');

// let server = createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write(`
//   <h1>Hello</h1>
//   <p>You asked for <code>${req.url}</code></p>`);
//   res.end();
// });

let server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // Response object is a "writeable stream". We can write multiple data as we go through it.
  // Stream's "end" method closes the stream and it can hold optional argument to write before closing.
  res.end('Tis the end');
});

server.listen(8000, () => console.log('Listening at port 8000'));
