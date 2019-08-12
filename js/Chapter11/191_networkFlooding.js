const { everywhere } = require('./modules/crow-tech');
const { requestType, request } = require('./modules/wrapped');

// NETWORK FLOODING
// Spreading a message throughout the web using each nest's neighbor list.
everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  // Saving to current nest's gossip array first.
  nest.state.gossip.push(message);
  // Then sending it to its neighbors.
  for (const neighbor of nest.neighbors) {
    // Except for previous nest which sends the message to current nest.
    if (neighbor === exceptFor) continue;
    request(nest, neighbor, 'gossip', message);
  }
}

requestType('gossip', (nest, message, source) => {
  /* The message spreading will stop here once certain nest has received the message and will return "undefined"
  to the promise. All operations will stop once every nests have received the message. */
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip from: ${source}`);
  sendGossip(nest, message, source);
});
