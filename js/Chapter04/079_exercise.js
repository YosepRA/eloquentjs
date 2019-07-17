// Sum-Range
function range(start, end, step) {
  let numArr = [];

  if (step) {
    if (step > 0) {
      for (let i = start; i <= end; ) {
        numArr.push(i);
        i += step;
      }
    } else if (step < 0) {
      for (let i = start; i >= end; ) {
        numArr.push(i);
        i += step;
      }
    }
  } else {
    for (let i = start; i <= end; i++) {
      numArr.push(i);
    }
  }

  return numArr;
}

function sum(numArr) {
  let result = 0;
  for (let i = 0; i < numArr.length; i++) {
    result += numArr[i];
  }
  return result;
}

// console.log(sum(range(1, 6, 2)));

// Reversing an Array
function reverseArray(arr) {
  let reversed = [];
  for (let i = 0; i < arr.length; i++) {
    reversed.unshift(arr[i]);
  }
  return reversed;
}

function reverseArrayInPlace(arr) {
  for (let i = 0; i <= Math.floor(arr.length / 2); i++) {
    let firstEl = arr[i];
    let lastEl = arr[arr.length - (1 + i)];
    arr[i] = lastEl;
    arr[arr.length - (1 + i)] = firstEl;
  }

  return arr;
}

// console.log(reverseArray(['Jack', 'Daniels']));
// console.log(reverseArrayInPlace([1, 2, 3, 4, 5, 6]));

// Converting an array to be a list of objects.
function arrayToList(arr) {
  let list;
  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i];
    const rest = i === arr.length - 1 ? null : list;
    let newList = {};

    newList.value = value;
    newList.rest = rest;

    list = newList;
  }
  return list;
}

// console.log(arrayToList([1, 2, 3]));
/* {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
} */

// Convert list to array.
function listToArray(list) {
  let arr = [];
  // Mine
  while (list) {
    arr.push(list.value);
    list = list.rest; // Proceed to the next nested list.
  }

  // Book
  // for (let node = list; node; node = node.rest) {
  //   arr.push(node.value);
  // }

  return arr;
}

// console.log(
//   listToArray({
//     value: 1,
//     rest: {
//       value: 2,
//       rest: {
//         value: 3,
//         rest: {
//           value: 4,
//           rest: null
//         }
//       }
//     }
//   })
// );

// To add new element to the front of the list.
function prepend(el, list) {
  return { value: el, rest: list };
}

// let list = arrayToList([1, 2, 3]);
// console.log(prepend({ value: 0, isGood: true }, list));

// To find the nth object in a list.
function nth(index, list) {
  const arr = listToArray(list);
  const value = arr[index];
  if (value) {
    for (let i = 0; i < arr.length; i++) {
      if (list.value === value) {
        return list;
      }
      list = list.rest;
    }
  } else {
    return;
  }
}

// Failed.
// It worked, but the output is incorrect. Index 0 will return the last instead of the first.
function recursiveNth(index, list) {
  // Book
  // It turned out that we just have to return the value instead of the whole list tree prior to given ~
  // ~ index position.
  if (!list) {
    return;
  } else if (index === 0) {
    return list.value;
  } else {
    return recursiveNth(index - 1, list.rest);
  }

  // Mine
  // if (!list) {
  //   return;
  // }
  // let arr = listToArray(list);
  // if (index === arr.length - 1) {
  //   return list;
  // } else {
  //   return recursiveNth(index, list.rest);
  // }
}

// let list = arrayToList([1, 2, 3]);
// console.log(recursiveNth(1, list));

function deepEqual(a, b) {
  if (a === b) return true;
  // typeof null is object. Check whether a or b is not an object.
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;

  // Mine
  // Flawed: Cannot compare nested objects and simple data types(string, number, etc).
  // Recursion needed to achieve that.
  // let allKeys = [...Object.keys(a), ...Object.keys(b)];
  // let uniqueKeys = [];
  // for (const key of allKeys) {
  //   if (!uniqueKeys.includes(key)) {
  //     uniqueKeys.push(key);
  //   }
  // }

  // for (const key of uniqueKeys) {
  //   if (a[key] !== b[key]) {
  //     return false;
  //   }
  // }

  // Book
  let keysA = Object.keys(a),
    keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

let objA = { here: { is: 'an' }, object: 2 };
let objB = { here: { is: 'an' }, object: 2 };

console.log(deepEqual(objA, objB));
