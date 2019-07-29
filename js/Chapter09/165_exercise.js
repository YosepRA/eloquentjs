/* ================================================================================================ */

// REGEXP GOLF
// Create as tiny a regular expression as possible given certain pattern.

// car and cat
let patternOne = /\bca[tr]s?\b/;
// console.log(patternOne.exec('cat'));
// console.log(patternOne.exec('car'));

// pop and prop
let patternTwo = /pr?op/;
// console.log(patternTwo.exec('prop'));
// console.log(patternTwo.exec('pop'));

// ferret, ferry, and ferrari
let patternThree = /ferr(et|y|ari)/;
// console.log(patternThree.exec('ferret'));
// console.log(patternThree.exec('ferry'));
// console.log(patternThree.exec('ferrari'));

// Any word ending in "ious"
// let patternFour = /\b\w*ious\b/i;
let patternFour = /ious\b/i;
// console.log(patternFour.exec('Delicious'));
// console.log(patternFour.exec('Ceremonious'));
// console.log(patternFour.exec('Curious'));
// console.log(patternFour.exec('ious'));

// A whitespace character followed by a period, comma, colon, or semicolon.
let patternFive = /\s*[.,:;]/;
// console.log(patternFive.exec('  .'));
// console.log(patternFive.exec('  ,'));
// console.log(patternFive.exec('  :'));
// console.log(patternFive.exec('  ;'));

// A word longer than 6 characters.
let patternSix = /\w{7}/;
// console.log(patternSix.exec('abc')); // null
// console.log(patternSix.exec('abcde')); // null
// console.log(patternSix.exec('abcdefgh')); // true

// A word without the letter "e" or "E";
let patternSeven = /\b[^\We]+\b/i;
// console.log(patternSeven.exec('REEEEEE'));
// console.log(patternSeven.exec('florie'));
// console.log(patternSeven.exec('Snoopy'));

function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == '...') return;
  for (let str of yes)
    if (!regexp.test(str)) {
      console.log(`Failure to match '${str}'`);
    }
  for (let str of no)
    if (regexp.test(str)) {
      console.log(`Unexpected match for '${str}'`);
    }
}

// verify(patternOne, ['my car', 'bad cats'], ['camper', 'high art']);

// verify(patternTwo, ['pop culture', 'mad props'], ['plop', 'prrrop']);

// verify(patternThree, ['ferret', 'ferry', 'ferrari'], ['ferrum', 'transfer A']);

// verify(patternFour, ['how delicious', 'spacious room'], ['ruinous', 'consciousness']);

// verify(patternFive, ['bad punctuation .'], ['escape the period']);

// verify(patternSix, ['hottentottententen'], ['no', 'hotten totten tenten']);

// verify(patternSeven, ['red platypus', 'wobbling nest'], ['earth bed', 'learning ape', 'BEET']);

/* ================================================================================================ */

// QUOTING STYLE
// Replace all single quoted dialogues with double quotes whilst leaving word like "aren't" as it is.
// 'You aren't the best in the world' → "You aren't the best in the world"
// let str = `This is a quote 'You aren't the best in the world' and 'You haven't been the best in the world'`;

// function dialogueQuotes(text) {
//   let contraction = /\b(\w+)('|~)(\w+)\b/g;
//   let quotes = /'(.*?)'/g;
//   text = text
//     .replace(contraction, '$1~$3')
//     .replace(quotes, '"$1"')
//     .replace(contraction, "$1'$3");

//   return text;
// }

// // console.log(dialogueQuotes(str));
// console.log(str.replace(/(^|\W)'|'(\W|$)/g, '$1"$2'));

/* ================================================================================================ */

// NUMBERS AGAIN
let jsNumberPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;
for (let str of ['1', '-1', '+15', '1.55', '.5', '5.', '1.3e2', '1E-4', '1e+12']) {
  if (!jsNumberPattern.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ['1a', '+-1', '1.2.3', '1+1', '1e4.5', '.5.', '1f5', '.']) {
  if (jsNumberPattern.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}
