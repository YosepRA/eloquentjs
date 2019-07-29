// let name = 'harry';
// let str = 'Harry is a suspicious character';
// // In a normal string, word boundaries must use double backslashes.
// // In RegExp slash notation, one backslash is enough.
// let pattern = new RegExp('\\b(' + name + ')\\b', 'gi');
// // Referring groups with $ sign. A whole match can be referred with "$&".
// console.log(str.replace(pattern, '_$1_'));

// Weird name
let name = 'dea+hl[]rd';
let str = 'dea+hl[]rd is a good guy';
// We want to escape every character that holds special meaning in regular expression.
let escaped = name.replace(/[\\[.+*?(){|^$]/g, '\\$&');
let pattern = new RegExp('\\b(' + escaped + ')\\b', 'gi');

console.log(str.replace(pattern, '_$1_'));
