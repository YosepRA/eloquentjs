const SCRIPT = require('./data/ch05-scripts');

function characterCount(script) {
  return script.ranges.reduce((count, [from, to]) => {
    return count + (to - from);
  }, 0);
}

// console.log(
//   SCRIPT.reduce((a, b) => {
//     return characterCount(a) < characterCount(b) ? b : a;
//   })
// );

function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

// let living = Math.round(average(SCRIPT.filter(script => script.living).map(script => script.year)));
// let died = Math.round(average(SCRIPT.filter(script => !script.living).map(script => script.year)));

// console.log(`Living: ${living}`);
// console.log(`Died: ${died}`);

// To find which script a given character code belongs to.
function characterScript(code) {
  for (const script of SCRIPT) {
    if (
      // Array.prototype.some(), will return true if one of the array's element fulfills the given condition.
      script.ranges.some(([from, to]) => {
        return code >= from && code < to;
      })
    ) {
      return script;
    }
  }
  return null;
}

// console.log(characterScript(74752));

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

// console.log(countBy([1, 2, 3, 4, 5], n => n > 2));

/* Given string 'abc'
  will return [{name: 'latin'}, ...]
  then count it */

// let str = 'ab電';
// let charaScripts = [];
// // Convert string to be an array of scripts for each characters.
// for (const chara of str) {
//   let foundScript = characterScript(chara.charCodeAt());
//   charaScripts.push(foundScript);
// }

// console.log(countBy(charaScripts, script => script.name));

function textScripts(text) {
  // We want an array of script for each of text's character.
  let scripts = countBy(text, char => {
    // Search the script of single character.
    let script = characterScript(char.codePointAt());
    // If there is a script for particular character, then return its name to countBy().
    return script ? script.name : 'none';
  }).filter(script => script.name !== 'none');

  let total = scripts.reduce((n, script) => n + script.count, 0);
  if (total === 0) return 'Script not found.';

  return scripts
    .map(({ name, count }) => {
      return `${Math.round((count * 100) / total)}% ${name}`;
    })
    .join(', ');
}

console.log(textScripts('ab電'));
console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
