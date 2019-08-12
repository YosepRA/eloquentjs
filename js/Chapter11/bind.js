let joe = {
  name: 'Joe',
  sayHi() {
    return `${this.name} says Hi!`;
  }
};
let andrew = {
  name: 'Andrew'
};

// let andrewHiCall = joe.sayHi.call(andrew);
// let andrewHiApply = joe.sayHi.apply(andrew);
let andrewHiBind = joe.sayHi.bind(andrew);

console.log(joe.sayHi());

// console.log(andrewHiCall);
// console.log(andrewHiApply);
console.log(joe.sayHi.call(andrew));
console.log(andrewHiBind());
