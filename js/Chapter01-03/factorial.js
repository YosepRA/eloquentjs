function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return factorial(n - 1) * n;
  }
}

console.log(factorial(3));
console.log(factorial(5));
console.log(factorial(7));
