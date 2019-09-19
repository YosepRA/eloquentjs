// SEARCH TOOL

// const { parse } = require('url');
// const { resolve, sep } = require('path');
// let baseDirectory = process.cwd();

// function urlPath(url) {
//   let { pathname } = parse(url);
//   let path = resolve(decodeURIComponent(pathname));
//   if (path !== baseDirectory && !path.startsWith(baseDirectory + sep)) {
//     throw { status: 403, body: 'Forbidden' };
//   }
//   return path;
// }

// console.log(parse('http://ago.co.uk/text.txt').pathname);
// process.stdout.write('test');
// node 367_exercise.js <regexp> <filename(s)>
// console.log(process.argv);

const { readFile, readFileSync, statSync, readdirSync } = require('fs');
const { resolve } = require('path');

// let regexp = process.argv[2],
//   filePath = resolve(process.argv[3]);

// readFile(filePath, 'utf8', (err, text) => {
//   if (err) throw err;
//   let pattern = new RegExp(regexp);

//   process.stdout.write(
//     text
//       .split('\r\n')
//       .filter(line => pattern.test(line))
//       .join('\n')
//   );
// });

// function grep(regexp, filePath) {
//   let basePath = resolve(filePath);
//   let pattern = new RegExp(regexp);
//   // result will hold the array of object with file's path and search results.
//   let result = [];

//   function search(basePath, file) {

//   }

//   let stats = statSync(path);
//   if (stats.isDirectory()) {
//     for (const file of readdirSync(path)) {
//       result = result.concat(search(regexp, file));
//     }
//   } else {
//     let text = readFileSync(path, 'utf8');
//     let matches = text.split('\r\n').filter(line => pattern.test(line));
//     result = result.concat(matches);
//   }
//   return result;
// }

// function search(regexp, filePath) {
//   let basePath = resolve(filePath);
//   let pattern = new RegExp(regexp);
//   let stats = statSync(basePath);
//   let results = [];

//   function read(file) {
//     let path = resolve(basePath, file);
//     let text = readFileSync(path, 'utf8');
//     let result = { file, matches: [] };
//     result.matches = text.split('\r\n').filter(line => pattern.test(line));
//     return result;
//   }

//   if (stats.isDirectory()) {
//     for (const file of readdirSync(basePath)) {
//       results = results.concat(read(file));
//     }
//   } else {
//     results = results.concat(read(basePath));
//   }
//   return results;
// }

// console.log(search(process.argv[2], process.argv[3]));

/* ======================================================================================================== */

// PUBLIC SPACE ON THE WEB

// 1. Create an HTML file with JS file attached to it. Load it using the browser.
// → HTML: index.html, JS: script.js

// 2. Create a UI for modifying file server through browser.
// SKIPPED!! → continued after finishing the book.
