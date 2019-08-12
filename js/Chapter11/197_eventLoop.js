// try {
//   setTimeout(() => {
//     throw new Error('err01');
//   }, 20);
//   // throw new Error('err02');
// } catch (_) {
//   // This wont get caught because the control has already out of the try block.
//   console.log('Caught Error');
// }
// // The log's result below will appear first whilst timeout hasn't finished.
// console.log('text');

// let start = Date.now();
// setTimeout(() => {
//   console.log('Timeout ran at:', Date.now() - start);
// }, 20);
// while (Date.now() < start + 50) {}
// console.log('Wasted time until', Date.now() - start);

// Promise always resolve or reject as a new event.
// Waiting for it will cause the callback to be called AFTER the current script has finished.
Promise.resolve('resolved').then(console.log);
console.log('first line');
console.log('second line');
console.log('third line');
