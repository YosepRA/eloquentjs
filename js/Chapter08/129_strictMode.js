'use strict';

function Person(name) {
  this.name = name;
}

// Missing "new" keyword. Without it and strict mode disabled, "this" will refer to global object.
let john = Person('John'); // And will create a global property/binding instead.
console.log(name); // 'John';
