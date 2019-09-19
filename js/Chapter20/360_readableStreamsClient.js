const { request } = require('http');

let options = {
  host: '127.0.0.1',
  port: 8000,
  method: 'POST'
};

let reqStream = request(options, res => {
  res.on('data', chunk => {
    process.stdout.write(chunk.toString());
  });
}).end('hello world');

reqStream.on('error', err => console.log(err));
