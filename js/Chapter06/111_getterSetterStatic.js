let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100);
  }
};

// By putting a "get" keyword in front of a method name, when we try to access that method ~
// ~ there's no need to put () and it will automatically invoked.
// console.log(varyingSize.size);
// console.log(varyingSize.size);

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return 1.8 * this.celsius + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }
  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

let temp = new Temperature(22);
// console.log(temp.fahrenheit); // Will automatically call a getter for property "fahrenheit".
// temp.fahrenheit = 86; // Will automatically call a setter for property "fahrenheit".
// console.log(temp.celcius); // 30

let fahrenTemp = Temperature.fromFahrenheit(86);
fahrenTemp.fahrenheit = 100;

console.log(fahrenTemp.celsius);
console.log(fahrenTemp.fahrenheit);
