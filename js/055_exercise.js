// Minimum
function min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

// console.log(min(5, 3));

// Recursion
function isEven(num) {
  if (num === 0) return true;
  else if (num === 1) return false;
  else if (num < 0) return isEven(-num);
  else return isEven(num - 2);
}

// console.log(isEven(2)); // true
// console.log(isEven(20)); // true
// console.log(isEven(33)); // false
// console.log(isEven(-1)); // false

// Bean Counting
function countBs(str) {
  return countChar(str, 'B');
}

function countChar(str, letter) {
  let counter = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === letter) {
      counter++;
    }
  }
  return counter;
}

console.log(countBs('BkajdkasdBjkdakjdBkjsdkjs')); // 3
console.log(countChar('kakkerlak', 'k')); // 4
