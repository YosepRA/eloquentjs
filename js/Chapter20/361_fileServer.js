const { createServer } = require('http');

let methods = Object.create(null);

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  // Handlers given request object will return a promise that will resolve as an object that describes ~
  // ~ the response.
  handler(request)
    .catch(err => {
      if (err.status !== null) return err;
      // If the error is unknown, send code 500 which means "Internal Server Error".
      return { body: String(err), status: 500 };
    })
    .then(({ body, status = 200, type = 'text/plain' }) => {
      response.writeHead(status, { 'Content-Type': type });
      // If body is a readable stream, it will have "pipe" method to forward all the contents to writable stream.
      // In this case, we want to load the contents we get to "response" writable stream.
      if (body && body.pipe) body.pipe(response);
      // If body isn't a readable stream, The body value is either null, string, or buffer ~
      // ~ and we will pass it right through "response.end".
      else response.end(body);
    });
}).listen(8000, () => console.log('Listening at port 8000'));

// Execute this function if there's no handler for certain type of request method.
async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} is not allowed`
  };
}

/* ======================================================================================================== */

const { parse } = require('url');
const { resolve, sep } = require('path');

const baseDirectory = process.cwd();

function urlPath(url) {
  // Node build-in package "url.parse" takes URLString, parses it, and returns a URL object.
  // "pathname" property will have a path string after url root path.
  // e.g: https://abysmalcat.com/blueberry/photos → returns "/blueberry/photos"
  let { pathname } = parse(url);
  // "path.resolve" resolves a sequence of path until it becomes an absolute path.
  // "decodeURIComponent" given URL string will decode a Uniform Resource Indentifier(URI). ~
  // ~ In short, it will get rid of escape codes such as "%20" for space.
  let path = resolve(decodeURIComponent(pathname).slice(1));
  // If client is trying to access file system outside of "baseDirectory" path, reject it.
  if (path !== baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: 'Forbidden' };
  }
  return path;
}

// let url = 'https://abysmalcat.com/blueberry/photos.html';
// let { pathname } = parse(url);
// // If in resolving a path still doesn't form an absolute path, the current working directory will be used.
// console.log(resolve(decodeURIComponent(pathname))); // 'C:\blueberry\photos.html'
// console.log(resolve(decodeURIComponent(pathname).slice(1))); // [Current Working Directory]\blueberry\photos.html

// let url = 'https://abysmalcat.com';
// let { pathname } = parse(url);
// console.log(resolve(pathname.slice(1)));

/* ======================================================================================================== */

const { createReadStream, createWriteStream } = require('fs');
const { stat, readdir, rmdir, unlink, mkdir } = require('fs').promises;
const mime = require('mime');

// let url = '/text.txt';
// let { pathname } = parse(url);
// let path = resolve(decodeURIComponent(pathname).slice(1));
// stat(path).then(stats => console.log(stats.size));

// READ
methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (err) {
    // "ENOENT" → No such file or directory.
    if (err.code !== 'ENOENT') throw err;
    else return { status: 404, body: 'File not found' };
  }
  if (stats.isDirectory()) {
    // If it's a directory, list all the contents inside it.
    // Note: We have to put brackets while calling readdir. If we don't and straight up chain it after ~
    // ~ "readdir" method, that will return nothing. Because "join" won't properly aim to array coming ~
    // ~ from readdir call BUT to readdir method instead.
    return { body: (await readdir(path)).join('\n') };
  } else {
    // If it's a file, load it up. This readable stream will end up in "response" writable stream.
    return { body: createReadStream(path), type: mime.getType(path) };
  }
};

// DELETE
methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // Code 204 → The action is successful, but there's no content planned to be returned.
    // Here we check for file's existence. Note that we're not throwing any error because of non-existent file, ~
    // ~ that's because when the file you're trying to delete isn't there, the request's objective has ~
    // ~ already been achieved. In short, regardless of the file's existence, it will have the same result.
    else return { status: 204 };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

// from → read stream, to → write stream
function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on('error', reject);
    to.on('error', reject);
    to.on('finish', resolve);
    from.pipe(to);
  });
}
// WRITE
methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};

// Create new directory.
methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // If there is no such directory, create a new one.
    await mkdir(path);
    return { status: 204 };
  }
  if (stats.isDirectory()) return { status: 204 };
  // Code 400 → Bad Request.
  // If user trying to create a file instead of directory using "MKCOL" method.
  else return { status: 400, body: 'Not a directory' };
};
