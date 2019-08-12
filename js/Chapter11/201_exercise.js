const { request } = require('./modules/wrapped');

function anyStorage(nest, target, name) {
  if (nest.name === target) return storage(nest, name);
  else return routeRequest(nest, target, 'storage', name);
}
function routeRequest(nest, target, type, content) {
  // If the destination is up ahead, send the intended request.
  if (nest.state.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest, target, nest.state.connections);
    if (!via) throw new Error(`Route not available to ${target}`);
    // Else, wrap the request arguments to the next nest closer to the destination.
    return request(nest, via, 'route', { target, type, content });
  }
}
function findRoute(from, to, connections) {
  let work = [{ at: from, via: null }];
  for (let i = 0; i < work.length; i++) {
    const { at, via } = work[i];
    for (const next of connections.get(at) || []) {
      // Eventually, one node will have the destination as its neighbor.
      // Then it will return the first value way back from the first step we take.
      // It assures us if we choose that route, it will take us to the destination.
      if (next === to) return via;
      if (!work.some(w => w.at === next)) {
        // "via" will stay the same as the first value it assigned to be.
        work.push({ at: next, via: via || next });
      }
    }
  }
  return null;
}

// TRACKING THE SCALPEL
// Nests: A  -  B  -  C
// A → B
// A: [A, B]; B: [A, B]; C: [];
// B → C
// A: [A, B]; B: [A, B, C]; C: [A, B, C];
// Create an async function to track the scalpel based on each nest "scalpel" history.
// Storage with key "scalpel" contains an array of nest breadcrumbs.
async function locateScalpel(nest) {
  // Retrieve the "scalpel" history from nest storage.
  let scalpel = await storage(nest, 'scalpel');
  let lastNest = scalpel[scalpel.length - 1];
  if (nest.name === lastNest) return nest;
  else await locateScalpel(lastNest);
}
function locateScalpel(nest) {
  return new Promise(resolve => {
    storage(nest, 'scalpel').then(scalpel => {
      let lastNest = scalpel[scalpel.length - 1];
      if (nest.name === lastNest) resolve(nest);
      else locateScalpel(lastNest);
    });
  }).catch(console.log);
}

// PROMISE ALL
// Create your own Promise.all
function Promise_all(array) {
  return new Promise((resolve, reject) => {
    let results = [];
    // Resolve it when all promises in a given array are successfully resolved.
    // And reject it if at least one of the promise returns a rejection.
    if (array.length === 0) resolve([]);
    for (const prom of array) {
      prom
        .then(value => {
          results.push(value);
          if (results.length === array.length) resolve(results);
        })
        .catch(reject);
    }
  });
}

// let num = [1, 2, 3, 4, 5];
// let rej = [Promise.resolve(15), Promise.reject(new Error('Tis a Rejection'))];
// // promise_all(num.map(n => Promise.resolve(n))).then(console.log, console.log);
// promise_all(rej)
//   .then(console.log)
//   .catch(err => console.log(`Promise rejection: ${err}`));

// Promise_all([]).then(array => {
//   console.log('This should be []:', array);
// });
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
// Promise_all([soon(1), soon(2), soon(3)]).then(array => {
//   console.log('This should be [1, 2, 3]:', array);
// });
Promise_all([soon(1), Promise.reject('X'), soon(3)])
  .then(array => {
    console.log('We should not get here');
  })
  .catch(error => {
    if (error != 'X') {
      console.log('Unexpected failure:', error);
    }
  });
