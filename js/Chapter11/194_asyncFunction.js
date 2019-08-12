const { requestType } = require('./modules/wrapped');

requestType('storage', (nest, name) => storage(nest, name));

// function findInStorage(nest, name) {
//   return storage(nest, name).then(found => {
//     if (found !== null) return found;
//     else return findInRemoteStorage(nest, name);
//   });
// }

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

// function findInRemoteStorage(nest, name) {
//   let sources = network(nest).filter(n => n !== nest.name);
//   function next() {
//     if (sources.length === 0) {
//       return Promise.reject(new Error('Not Found'));
//     } else {
//       let source = source[Math.floor(Math.random() * sources.length)];
//       sources = sources.filter(s => s !== source);
//       return routeRequest(nest, source, 'storage', name).then(
//         value => (value !== null ? value : next()),
//         next
//       );
//     }
//   }
//   return next();
// }

/* Putting "async" in front of function or method declaration will make that function returns a promise.
Once a return value has been defined, the promise will get resovled, and rejected otherwise if it throws
an exception. */
async function findInStorage(nest, name) {
  /* We can put "await" to HOLD the function process and wait until the promise returned from an expression
  to be either resolved or rejected, then it can continue its process. */
  let local = await storage(nest, name);
  if (local !== null) return local;

  let sources = network(nest).filter(n => n !== nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() * sources.length)];
    sources = sources.filter(n => n !== source);
    try {
      let found = await routeRequest(nest, source, 'storage', name);
      if (found !== null) return found;
    } catch (_) {}
  }
  throw new Error('Not Found');
}
