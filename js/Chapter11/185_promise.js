const { bigOak } = require('./modules/crow-tech');

// PROMISES
let fifteen = Promise.resolve(15);
// A function assigned to "then" will be called once a promise "resolves" and produces a value.
fifteen.then(value => console.log(value)); // 15

// Promise based "readStorage".
// Creating a promise with a function that could resolve the promise as its argument.
function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

storage(bigOak, 'food caches').then(value => `Got: ${value}`);

function timeout(cb, time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cb);
    }, time);
  }).then(value => {
    value();
  });
}

timeout(() => {
  console.log('TICK');
}, 2000);

console.log('start');
