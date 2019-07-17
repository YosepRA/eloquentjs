let string = JSON.stringify({
  squirrels: false,
  events: ['weekend']
});

console.log(typeof string);
console.log(JSON.parse(string).events);
