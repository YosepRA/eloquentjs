// console.log(/abc/.test('abcde')); // true
// console.log(/abc/.test('abxce')); // false

// Sets of Characters.
// If a string contains at least one character inside square bracket, then it will return true.
// console.log(/[345678]/.test('in 1992')); // false
// A hyphen (-) indicates a range of characters.
// Every square brackets or sets of characters represents one digit in a pattern.
console.log(/[0-9]abc/.test('1abcd')); // true
console.log(/[0-9]abc/.test('1ab')); // false
// console.log(/[a-c]/.test('cdef'));
