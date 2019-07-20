function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
}

let fluffy = new Dog('Fluffy', 'Lab');

console.log(fluffy.__proto__.__proto__);
// Basic prototype of an object created by constructors are:
// - constructor = Function.prototype
// - __proto__ = Object.prototype
// - __proto__ = Object.prototype
