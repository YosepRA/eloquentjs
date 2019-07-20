// Similar to using function constructor but less awkward.
class Dog {
  constructor(name, breed) {
    this.name = name;
    this.breed = breed;
  }
  // This is not a non-method prototype property.
  isMammal = true;

  bark() {
    return `${this.name} says WOOF!`;
  }

  saySomething(text) {
    return `${this.name} says '${text}'`;
  }
}

Dog.prototype.legsCount = 4;

let fluffy = new Dog('Fluffy', 'Lab');
let rusty = new Dog('Rusty', 'Retriever');
// rusty's legsCount property overshadows the Dog.prototype.legsCount.
rusty.legsCount = 6;

console.log(rusty.bark());
console.log(rusty.saySomething('You are cool!'));
console.log(rusty.isMammal);
console.log(rusty.legsCount);
