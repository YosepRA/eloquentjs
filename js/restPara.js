// Rest Parameter
// Accepts any amount of arguments.
// Could be embedded inbetween arguments and an array using triple dots ("...para").
function max(...numbers) {
  let result = -Infinity;
  for (const number of numbers) {
    if (number > result) result = number;
  }
  return result;
}

let arrNum = [1, 2, 3];
// console.log(max(10, ...arrNum, 4)); // 10
console.log([0, ...arrNum, 4]); // [ 0, 1, 2, 3, 4 ];
