const { createServer } = require('http');

let server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // "data" event will be fired whenever a new data comes in the stream.
  req.on('data', chunk => {
    res.write(chunk.toString().toUpperCase());
  });
  // "end" will be fired when a stream comes to an end.
  req.on('end', () => res.end());
});

server.listen(8000, () => console.log('Listening at port 8000'));
