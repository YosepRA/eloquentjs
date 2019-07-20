/* ========== NOTES ========== */

// Symbols are useful when you want to create a unique key for objects.
// There are no two similar symbols, both are unique although the string given to Symbol function is the same.
// Symbol(description), description is optional and doesn't mean anything other than to indicate the symbol's ~
// ~ name when debugging.

/* =========================== */

class Rabbit {
  constructor(type) {
    this.type = type;
  }

  sayHi() {
    return `${this.type} rabbit says Hi!`;
  }

  speak(text) {
    return `${this.type} rabbit says '${text}'`;
  }
}
// let sym = Symbol('name');
// Rabbit.prototype[sym] = 55;

// let killerRabbit = new Rabbit('Killer');

// console.log(killerRabbit.sayHi());
// console.log(killerRabbit.speak('You looked delicous!'));
// console.log(killerRabbit[sym]);

const toStringSymbol = Symbol('toString');
Array.prototype[toStringSymbol] = function() {
  return `${this.length} cm of blue yarn`;
};

// Accessing method using [] notation and pass in a binding that holds the correct symbol.
// console.log([1, 2, 3, 'hey'][toStringSymbol]()); // '4 cm of blue yarn'
// console.log(String([1, 2, 3])); // '1, 2, 3'

// Symbols could also be used in object expression using [] notation.
let stringObject = {
  [toStringSymbol]() {
    return `a juxtapose`;
  }
};
// Accessing it with [] notation as well.
// console.log(stringObject[toStringSymbol]());
