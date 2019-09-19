const { formatDate } = require('./modules/format-date');

console.log(formatDate(new Date(), 'MMMM Do, YYYY')); // September 16th, 2019
console.log(formatDate(new Date(), 'dddd, D MMMM YYYY')); // Monday, 16 September 2019
