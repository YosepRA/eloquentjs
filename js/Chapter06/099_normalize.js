function normalize() {
  console.log(
    this.coords.map(n => {
      console.log(this);
      return n / this.length;
    })
  );
}

// Not working: "this" refers to global object.
// function normalize() {
//   console.log(
//     this.coords.map(function(n) {
//       return n / this.length;
//     })
//   );
// }

normalize.call({ coords: [1, 2, 3], length: 5 });
