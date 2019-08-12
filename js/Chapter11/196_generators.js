function* powers(n) {
  for (let current = n; ; current *= n) {
    // "yield" will be the next iteration value given to the loop.
    yield current;
  }
}

for (const power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}

// Writing a generator for Chapter 6 Groups exercise.
// Instead of writing our own iterator, we use generator.
Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.items.length; i++) {
    yield this.items[i];
  }
};
