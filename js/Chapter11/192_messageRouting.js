const { request, requestType } = require('./modules/wrapped');
const { everywhere } = require('./modules/crow-tech');

requestType('connections', (nest, { name, neighbors }, source) => {
  let connections = nest.state.connections;
  // Comparing two objects using JSON string instead of its actual object value.
  // Because we can't compare two objects/arrays plain value with either "==" or "===" against each other.
  if (JSON.stringify(connections.get(name)) === JSON.stringify(neighbors)) return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

// Broadcasting connections to node's neighbors.
function broadcastConnections(nest, name, exceptFor = null) {
  for (const neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, 'connections', {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map();
  nest.state.connections.set(nest.name, nest.neighbors);
  // Every nest will start spreading their own connections data to its neighbor.
  broadcastConnections(nest, nest.name);
});

// This will choose the next route to take that will lead to destination.
// The next node will do this mechanism all over again.
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

requestType('route', (nest, { target, type, content }) => {
  return routeRequest(nest, target, type, content);
});
