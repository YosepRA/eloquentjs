const { readFile } = require('fs');

// If we pass a character encoding as one of the arguments, it will use that to decode the file ~
// ~ into a string.
readFile('354_parseINI.js', 'utf8', (err, text) => {
  if (err) throw err;
  // console.log(`The contents of the text is: "${text}"`);
  console.log(text);
  // console.log(text.split('\r\n'));
});

// // If we don't pass an encoding, It will return a buffer instead.
// readFile('./355_text.txt', (err, buffer) => {
//   if (err) throw err;
//   console.log(`The file contained ${buffer.length} bytes. The first byte is: ${buffer[0]}`);
//   // console.log(buffer[0]);
// });
