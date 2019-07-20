class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y);
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }

  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}

class SymmetricMatrix extends Matrix {
  constructor(size, element = (x, y) => undefined) {
    super(size, size, (x, y) => {
      if (x < y) return element(y, x);
      else return element(x, y);
    });
  }

  set(x, y, value) {
    super.set(x, y, value);
    if (x !== y) {
      super.set(y, x, value);
    }
  }
}

// let matrixA = new SymmetricMatrix(5, (x, y) => `value ${x}, ${y}`);
// console.log(matrixA.get(1, 2));

// Inverse Matrix 3 x 3

// 1  2  3     1  4  7
// 4  5  6     2  5  8
// 7  8  9     3  6  9

class Dog {
  constructor(name, breed) {
    this.name = name;
    this.breed = breed;
  }

  bark() {
    return `${this.name} says WOOF WOOF`;
  }
}

let fluffy = new Dog('Fluffy', 'Lab');
console.log(fluffy.bark());

// ModelDog is a descendant of Dog.
class ModelDog extends Dog {
  constructor(name, breed, age) {
    super(name, breed); // Creating new instance based on superclass constructor.
    this.age = age; // Assign the returning object from superclass with new property.
  }

  swirl() {
    return `${this.name} is a Model Dog that can swirl..`;
  }
}

let rusty = new ModelDog('Rusty', 'Retriever', 6);
console.log(rusty.bark()); // "Rusty says WOOF WOOF" // Inherited from Dog class.
console.log(rusty.swirl()); // "Rusty is a Model Dog that can swirl.." // Prototype of ModelDog.
console.log(rusty.age); // 6 // Unique for each of ModelDog instances.
