const SCRIPT = require('./data/ch05-scripts');

function flatten(array) {
  return array.reduce((a, b) => a.concat(b));
}

// console.log(flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));

// Custom loop
// Collections, test function, update function, and call back.
// For each iteration, use "test" to check the condition
// if true, then do callback and update
// if false, continue the loop.
function loop(start, test, update, body) {
  // Mine
  // Notes: It turns out that the first parameter isn't an array but a starting value instead.
  // So, the logic below won't work.
  // let current = 0;
  // for (const item of items) {
  //   if (test(item)) {
  //     body(current);
  //   }
  //   current = update(current, item);
  // }

  // Book
  for (let value = start; test(value); value = update(value)) {
    body(value);
  }
}

// loop(
//   [1, 2, 3],
//   item => item > 0,
//   current => console.log(current),
//   (current, item) => current + item
// );

// loop(0, value => value < 10, value => value + 2, console.log);
// loop(3, n => n > 0, n => n - 1, console.log);

// Loop through a collection and returns true if all items fulfill the given condition.
// Using regular loop.
// function everything(items, test) {
//   for (const item of items) {
//     if (!test(item)) {
//       return false;
//     }
//   }
//   return true;
// }

// Using Array.prototype.some().
// This method will return true if one of the collection's element fulfills the given test ~
// ~ and then short circuit.
function everything(items, test) {
  return !items.some(item => !test(item));
}

// console.log(everything([1, 2, 3], item => item >= 1));

// To find which script a given character code belongs to.
function characterScript(code) {
  for (const script of SCRIPT) {
    if (
      script.ranges.some(([from, to]) => {
        return code >= from && code < to;
      })
    ) {
      return script;
    }
  }
  return null;
}

// To count the amount of data per group.
function countBy(items, groupName) {
  let counts = [];
  for (const item of items) {
    let name = groupName(item); // Name of the group
    let known = counts.findIndex(c => c.name === name); // Find out name's existence in counts.
    if (known === -1) {
      // If there isn't.
      counts.push({ name, count: 1 }); // Then create new group and initiate counter at 1.
    } else {
      // If there is.
      counts[known].count++; // Increment the existing counter in a group.
    }
  }
  return counts;
}

// To determine the dominant reading direction between script types in a given string.
// The string could have more that one type of script.
function dominantDirection(string) {
  // Mine
  let strScripts = [];
  for (const char of string) {
    let script = characterScript(char.codePointAt());
    if (script) {
      strScripts.push(script);
    }
  }

  let count = countBy(strScripts, script => script.direction).reduce((current, script) => {
    if (script.count > current.count) {
      return script;
    }
    return current;
  });

  return count.name;

  // Book
  // let counted = countBy(string, char => {
  //   let script = characterScript(char.codePointAt());
  //   return script ? script.direction : 'none';
  // }).filter(script => script.name !== 'none');

  // if (counted.length === 0) return 'ltr';

  // return counted.reduce((current, script) => (script.count > current.count ? script : current))
  //   .name;
}

// function dominantDirection(text) {
//   let counted = countBy(text, char => {
//     let script = characterScript(char.codePointAt(0));
//     return script ? script.direction : 'none';
//   }).filter(({ name }) => name != 'none');

//   if (counted.length == 0) return 'ltr';

//   return counted.reduce((a, b) => (a.count > b.count ? a : b)).name;
// }

console.log(dominantDirection('abc传/傳传/傳خخخخخخخخخخخخ'));
