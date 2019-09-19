const { writeFile } = require('fs');

// writeFile will write a file to the disk.
writeFile('./356_grafitti.txt', 'Node was here', err => {
  if (err) throw err;
  console.log('File written successfully');
});
