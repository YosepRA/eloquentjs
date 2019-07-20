// let okIterator = 'OK'[Symbol.iterator]();

// console.log(okIterator.next());
// console.log(okIterator.next());
// console.log(okIterator.next());

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

class MatrixIterator {
  constructor(matrix) {
    this.x = 0;
    this.y = 0;
    this.matrix = matrix;
  }

  next() {
    if (this.y === this.matrix.height) return { done: true };
    // Building value object based on current x and y values.
    // This object will contain the position and its value.
    let value = {
      x: this.x,
      y: this.y,
      value: this.matrix.get(this.x, this.y)
    };
    // Proceed to next column
    this.x++;
    // Check if we've reached the end of a row.
    if (this.x === this.matrix.width) {
      this.x = 0; // Reset the column to the most front.
      this.y++; // Proceed to next row.
    }
    return { value, done: false };
  }
}

Matrix.prototype[Symbol.iterator] = function() {
  return new MatrixIterator(this);
};

let matrixA = new Matrix(2, 2, (x, y) => `value ${x}, ${y}`);

// let matrixIterate = matrixA[Symbol.iterator]();
// console.log(matrixIterate.next());
// console.log(matrixIterate.next());

for (const { x, y, value } of matrixA) {
  console.log(x, y, value);
}
