const { bigOak } = require('./modules/crow-tech');
const { requestType, request } = require('./modules/wrapped');

// COLLECTION OF PROMISES
requestType('ping', () => 'pong');

function availableNeighbors(nest) {
  /* Creating an array of promises containing booleans of whether a designated nest's neighbors responding to "ping" 
  request call. */
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, 'ping')
      .then(() => true)
      .catch(() => false);
  });
  /* This will return a promise containing collection of promises and will resolve as an array or reject if one 
  of the promise gets rejected */
  return Promise.all(requests).then(result => {
    nest.neighbors.filter((_, index) => result[index]);
  });
}

availableNeighbors(bigOak);
