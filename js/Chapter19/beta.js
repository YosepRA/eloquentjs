let positions = [{ x: 10, y: 10 }, { x: 15, y: 15 }, { x: 20, y: 20 }];

const around = [
  { dx: 1, dy: 0 },
  { dx: 1, dy: 1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: -1 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: -1 }
];

// function pointsAround(pos) {
//   let pointsAround = [];
//   for (const { dx, dy } of around) {
//     pointsAround.push({ x: pos.x + dx, y: pos.y + dy });
//   }
//   return pointsAround;
// }

// function closestPoint(a, c) {

// }

// let closest = positions.map(pointsAround);

// console.log(closest);

// console.log(
//   around.map(({ dx, dy }) => {
//     return { x: 10 + dx, y: 10 + dy };
//   })
// );

function reduce(array, combine, start) {
  // Add the option to omit starting value.
  let current = start ? start : array[0];

  if (start) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      current = combine(current, element);
    }
  } else {
    for (let i = 1; i < array.length; i++) {
      const element = array[i];
      current = combine(current, element);
    }
  }

  // Start value must be added.
  // for (const element of array) {
  //   current = combine(current, element);
  // }
  return current;
}

let num = [4, 2, 3];
console.log(reduce(num, (a, c) => a + c));

let smallest = num.reduce((a, b) => (b < a ? b : a));
console.log(smallest);
