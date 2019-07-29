let text = '1 apple, 5 bananas, and a 100 of eggs';
let pattern = /\d+/g;
let match;

while ((match = pattern.exec(text))) {
  console.log(`Found: ${match[0]} at index ${match.index}`);
}
