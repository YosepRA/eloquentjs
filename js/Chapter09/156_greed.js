// let str = '1 + /* 2 */3';
// let stripComments = /\/\/.*|\/\*[^]*\*\//g;
function stripComments(code) {
  // First branch matches two slashes followed by any number of non-newline character(represented by ".*").
  // Second branch is more elaborate. Remember the concept of "Greed" and "Backtracking" from repetition operators.
  // [^] means any character.
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
}

console.log(stripComments('1 + /* 2 */3')); // 1 + 3
console.log(stripComments('x = 10; // go!'));
console.log(stripComments('1 /* a */+/* b */ 1'));
