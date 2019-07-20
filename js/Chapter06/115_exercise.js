// Vector
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus({ x, y }) {
    this.x += x;
    this.y += y;
    return this;
  }

  minus({ x, y }) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  get length() {
    // Distance between (0, 0) and current coordinate.
    let x1, y1, x2, y2;
    x1 = 0;
    y1 = 0;
    x2 = this.x;
    y2 = this.y;
    let square = function(value) {
      return value * value;
    };

    return Math.sqrt(square(x2 - x1) + square(y2 - y1));
  }
}

// let vectorOne = new Vector(2, 2);
// console.log(vectorOne.plus(new Vector(1, 1))); // 2, 2
// console.log(vectorOne.minus(new Vector(4, 4))); // -1, -1
// console.log(new Vector(3, 4).length); // 5

// ==========================================================================================

// Groups.
// Create a "Set" like class.
class Groups {
  constructor(items = []) {
    // items must be iterable.
    this.items = items;
  }

  add(value) {
    if (this.has(value)) return this.items;

    this.items.push(value);
    return this.items;
  }
  delete(value) {
    if (!this.has(value)) return this.items;
    // Mine
    // let valueIndex = this.items.indexOf(value);
    // this.items.splice(valueIndex, 1);

    // Book
    // Note: Array methods like filter, reduce, map doesn't modify existing array ~
    // ~ but create a new one and return it. So we have to bind it to use it.
    this.items = this.items.filter(item => item !== value);
    return this.items;
  }
  has(value) {
    return this.items.includes(value);
  }

  static from(obj) {
    return new Groups(Object.values(obj));
  }
}

// let groupsOne = new Groups();
// console.log(groupsOne.add(1)); // [ 1 ]
// console.log(groupsOne.add(2)); // [ 1, 2 ]
// console.log(groupsOne.add('Hello')); // [ 1, 2, 'Hello' ]
// console.log(groupsOne.delete('Helo')); // [ 1, 2, 'Hello' ] // 'Helo' isn't found.
// console.log(groupsOne.delete(2)); // [ 1, 'Hello' ]
// console.log(groupsOne.has(1)); // true
// console.log(groupsOne.has('Hello')); // true
// console.log(groupsOne.has(10)); // false
// let fluffy = {
//   name: 'Fluffy',
//   breed: 'Lab',
//   age: 6
// };
// let groupsTwo = Groups.from(fluffy);
// console.log(groupsTwo.items); // [ 'Fluffy', 'Lab', 6 ]

// ==========================================================================================

class IteratorGroups {
  constructor(groups) {
    this.index = 0;
    this.groups = groups;
  }

  next() {
    if (this.index === this.groups.items.length) return { done: true };

    let value = this.groups.items[this.index];
    this.index++;
    return { value, done: false };
  }
}

Groups.prototype[Symbol.iterator] = function() {
  return new IteratorGroups(this);
};

// let groupsThree = new Groups([1, 2, 3]);
// console.log(groupsThree);
// let groupIterate = groupsThree[Symbol.iterator]();
// console.log(groupIterate.next());
// console.log(groupIterate.next());
// console.log(groupIterate.next());
// for (const item of groupsThree) {
//   console.log(item);
// }

// ==========================================================================================

// Borrowing a Method
let hasOwnProperty = Symbol('Symbol.hasOwnProperty');
let objOne = {
  name: 'Joe',
  [hasOwnProperty]() {
    return 'Hello World!';
  }
};

// console.log(objOne[hasOwnProperty]()); // 'Hello World!
// console.log(objOne.hasOwnProperty('name')); // true
// console.log(Object.prototype.hasOwnProperty.call(objOne, 'name')); // true
