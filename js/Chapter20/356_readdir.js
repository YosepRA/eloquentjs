// CALLBACK
const { readdir } = require('fs');
readdir('d:/Download', (err, files) => {
  if (err) throw err;
  console.log(files.join('\n'));
});

// PROMISE
// const { readdir } = require('fs').promises;
// readdir('./').then(result => console.log(result));
