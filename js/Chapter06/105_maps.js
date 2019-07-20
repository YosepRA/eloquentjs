let ages = new Map();

// Map.set() will either create a new key-value pair or update an existing one.
ages.set('Boris', 19);
ages.set('Julia', 23);
ages.set('Alex', 15);

// Updating existing value.
// ages.set('Boris', 40);

// Map.has() will search for key and returns true if found one.
// console.log(ages.has('Alex'));

// Searching 'toString' won't work because we're looking for 'key' instead of 'property'
// console.log(ages.has('toString'));

console.log(ages.get('Boris')); // 19
console.log(ages.get('Julia')); // 23

// ("propertyName" in object) searches for property name inside an object tree.
// console.log('Alex' in ages);
// console.log('toString' in ages);
