const { formatDate } = require('./modules/format-date');

console.log(formatDate(new Date(), 'MMMM Do, YYYY'));
console.log(formatDate(new Date(), 'dddd, D MMMM YYYY'));
