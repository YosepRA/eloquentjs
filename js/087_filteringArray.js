const SCRIPT = require('./data/ch05-scripts');

function filter(array, test) {
  let filtered = [];
  for (const element of array) {
    if (test(element)) {
      filtered.push(element);
    }
  }
  return filtered;
}

// let ltrDirection = filter(SCRIPT, script => script.direction === 'ltr');
// console.log(ltrDirection.length);

function map(array, transform) {
  let mapped = [];
  for (const element of array) {
    mapped.push(transform(element));
  }
  return mapped;
}

// let scriptNames = map(SCRIPT, script => script.name);
// console.log(scriptNames.length);

function reduce(array, combine, start) {
  // Add the option to omit starting value.
  let current = start ? start : array[0];

  if (start) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      current = combine(current, element);
    }
  } else {
    for (let i = 1; i < array.length; i++) {
      const element = array[i];
      current = combine(current, element);
    }
  }

  // Start value must be added.
  // for (const element of array) {
  //   current = combine(current, element);
  // }
  return current;
}

// console.log(reduce([1, 2, 3, 4], (a, b) => a + b));
// console.log([1, 2, 3, 4].reduce((a, b) => a + b));
