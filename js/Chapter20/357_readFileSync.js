// Many of the functions in "fs" also have either synchronous or asynchronous(callback & promise) version.
// The synchronous version of a function will have "Sync" as its appending name.
const { readFileSync } = require('fs');

console.log(`The file contains: ${readFileSync('./355_text.txt', 'utf8')}`);
