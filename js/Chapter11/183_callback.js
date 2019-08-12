'use strict';

// CALLBACKS
// import { bigOak, defineRequestType } from './crow-tech';
const { bigOak, defineRequestType, network } = require('./modules/crow-tech');

// // Callback based interface provided by crow-tech module.
// bigOak.readStorage('food caches', caches => {
//   let firstCache = caches[0];
//   bigOak.readStorage(firstCache, info => {
//     console.log(info);
//   });
// });

// To make nests capable of receiving any kinds of request types, receiver nests must define request type first.
// Each type can define its own handler when a request of respective type comes in. When the request comes in, ~
// ~ the handler is called to produce a "response".
// The fourth argument "done" is a callback function it MUST call when it's done with the request.
defineRequestType('note', (nest, content, source, done) => {
  console.log('Gone');
  console.log(`${nest.name} received note: ${content}`);
  done();
});

// Nests have "send" method to send requests.
// args → (target, type, content, callback)
// The function will be called when a RESPONSE comes in.
bigOak.send(network.nodes['Cow Pasture'], 'note', "Let's caw loudly now", (err, response) => {
  console.log('Note delivered.');
});

// console.log(network.types);
