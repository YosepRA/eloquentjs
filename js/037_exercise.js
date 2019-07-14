function loopTriangle(num) {
  // Mine
  /* let result = '#';
  for (let i = 0; i < num; i++) {
    console.log(result);
    result += '#';
  } */
  // Book
  for (let line = '#'; line.length < num; line += '#') console.log(line);
}

// loopTriangle(8);

function fizzBuzz() {
  // Mine
  for (let i = 1; i <= 100; i++) {
    let result = '';
    if (i % 3 === 0 && i % 5 === 0) {
      result += 'FizzBuzz';
    } else if (i % 5 === 0) {
      result += 'Buzz';
    } else if (i % 3 === 0) {
      result += 'Fizz';
    }
    console.log(result || i);
  }
  // Book
  /* for (let n = 1; n <= 100; n++) {
    let output = '';
    if (n % 3 == 0) output += 'Fizz';
    if (n % 5 == 0) output += 'Buzz';
    console.log(output || n);
  } */
}

// fizzBuzz();

function chessBoard(width, height) {
  // Mine
  /* for (let i = 0; i < height; i++) {
    console.log(generateChess(i, width));
  } */
  // Book
  let board = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((x + y) % 2 == 0) {
        board += ' ';
      } else {
        board += '#';
      }
    }
    board += '\n';
  }

  console.log(board);
}
function generateChess(index, width) {
  let result = '';
  // if index is even, start with '#'.
  if (index % 2 === 0) {
    for (let i = 1; i <= width; i++) {
      i % 2 === 0 ? (result += ' ') : (result += '#');
    }
  } else {
    // and start with 'space' otherwise
    for (let i = 1; i <= width; i++) {
      i % 2 === 0 ? (result += '#') : (result += ' ');
    }
  }
  return result;
}

chessBoard(10, 15);
