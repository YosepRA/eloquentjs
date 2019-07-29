let s = '1 apple, 2 cabbages, and 101 eggs';

// The parameters here are what returned from a regular expression match.
function minusOne(match, amount, item) {
  amount = Number(amount) - 1;
  if (amount === 1) {
    item = item.slice(0, item.length - 1);
  }
  return `${amount} ${item}`;
}

console.log(s.replace(/(\d+) (\w+)/g, minusOne));
