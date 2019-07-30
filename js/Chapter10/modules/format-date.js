const ordinal = require('ordinal'),
  names = require('date-names');

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag === 'YYYY') return date.getFullYear();
    if (tag === 'M') return date.getMonth();
    if (tag === 'MMMM') return names.months[date.getMonth()];
    if (tag === 'D') return date.getDate();
    if (tag === 'Do') return ordinal(date.getDate());
    if (tag === 'dddd') return names.days[date.getDay()];
  });
};
